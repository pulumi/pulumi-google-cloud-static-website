// Copyright 2016-2021, Pulumi Corporation.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import * as pulumi from "@pulumi/pulumi";
import * as gcp from "@pulumi/gcp";
import * as mime from "mime";
import * as glob from "glob";

export interface WebsiteArgs {
    sitePath: string;
    indexDocument: string;
    errorDocument: string;
    withCDN: boolean;
    domain?: string;
    subdomain?: string;
}

export class Website extends pulumi.ComponentResource {
    public readonly originURL: pulumi.Output<string>
    public readonly cdnURL?: pulumi.Output<string>;
    public readonly customDomainURL?: pulumi.Output<string>;

    private sitePath: string;
    private indexDocument?: string;
    private errorDocument?: string;
    private withCDN: boolean;
    private domain?: string;
    private subdomain?: string;

    constructor(name: string, args: WebsiteArgs, opts?: pulumi.ComponentResourceOptions) {
        super("google-cloud-static-website:index:Website", name, args, opts);

        this.sitePath = args.sitePath;
        this.indexDocument = args.indexDocument || "index.html";
        this.errorDocument = args.errorDocument || "error.html";
        this.withCDN = args.withCDN;
        this.domain = args.domain;
        this.subdomain = args.subdomain;

        // Create a storage bucket for the website.
        const bucket = new gcp.storage.Bucket("my-bucket", {
            location: "US",
            forceDestroy: true,
            website: {
                mainPageSuffix: this.indexDocument,
                notFoundPage: this.errorDocument,
            },
        }, { parent: this });

        // Make bucket objects publicly accessible by default.
        const binding = new gcp.storage.BucketIAMBinding("my-bucket-iam-binding", {
            bucket: bucket.name,
            role: "roles/storage.objectViewer",
            members: [
                "allUsers",
            ],
        }, { parent: this });

        // Upload the files of the website as managed Pulumi resources.
        const sitePath = this.sitePath;
        const files = glob.sync(`${sitePath}/**/*`, { nodir: true });
        files.map(file => {
            const relativePath = file.replace(`${sitePath}/`, "");
            new gcp.storage.BucketObject(relativePath, {
                bucket: bucket.name,
                name: relativePath,
                source: new pulumi.asset.FileAsset(file),
                contentType: mime.getType(relativePath) || "text/plain",
            }, { parent: this });
        });

        this.originURL = pulumi.interpolate`https://storage.googleapis.com/${bucket.name}/${this.indexDocument}`;

        // Create a profile for the CDN.
        if (this.withCDN) {
            
            // Define the bucket as a backend bucket.
            const backendBucket = new gcp.compute.BackendBucket("my-backend-bucket", {
                bucketName: bucket.name,
                enableCdn: true,
            }, { parent: this });

            // Create a global public IP address.
            const ip = new gcp.compute.GlobalAddress("address", {}, { parent: this });

            // Map the IP address to the backend bucket.
            const map = new gcp.compute.URLMap("map", {
                defaultService: backendBucket.selfLink,
            }, { parent: this });

            // Create an HTTP proxy for public access.
            const httpProxy = new gcp.compute.TargetHttpProxy("http-proxy", {
                urlMap: map.selfLink,
            }, { parent: this });

            // Create an HTTP forwarding rule.
            const httpForwardingRule = new gcp.compute.GlobalForwardingRule("http-forwarding-rule", {
                ipAddress: ip.address,
                ipProtocol: "TCP",
                portRange: "80",
                target: httpProxy.selfLink,
            }, { parent: this });
            
            // Export the IP address as the CDN endpoint.
            this.cdnURL = pulumi.interpolate`http://${ip.address}`;

            if (this.domain) {

                // Google names its managed domain names by replacing dots with dashes.
                const zone = gcp.dns.getManagedZoneOutput({ name: this.domain.replace(/\./g, "-") });
            
                let fqdn = zone.dnsName;
                if (this.subdomain) {
                    fqdn = pulumi.interpolate`${this.subdomain}.${zone.dnsName}`;
                }

                const recordSet = new gcp.dns.RecordSet("record-set", {
                    name: fqdn,
                    type: "A",
                    managedZone: zone.name,
                    rrdatas: [
                        ip.address,
                    ],
                }, { parent: this });

                const cert = new gcp.compute.ManagedSslCertificate("cert", {
                    managed: {
                        domains: [
                            fqdn,
                        ],
                    },
                }, { parent: this });

                const httpsProxy = new gcp.compute.TargetHttpsProxy("https-proxy", {
                    urlMap: map.selfLink,
                    sslCertificates: [
                        cert.selfLink,
                    ],
                }, { parent: this });

                const httpsForwardingRule = new gcp.compute.GlobalForwardingRule("https-forwarding-rule", {
                    ipAddress: ip.address,
                    ipProtocol: "TCP",
                    portRange: "443",
                    target: httpsProxy.selfLink,
                }, { parent: this });

                // Export the URL of the custom domain.
                this.customDomainURL = zone.dnsName.apply(name => {
                    return `https://${this.subdomain ? `${this.subdomain}.` : ""}${name.split(".").filter(s => s !== "").join(".")}`;
                });
            }
        }
        
        // Register all outputs.
        this.registerOutputs({
            originURL: this.originURL,
            cdnURL: this.cdnURL,
            customDomainURL: this.customDomainURL,
        });
    }
}
