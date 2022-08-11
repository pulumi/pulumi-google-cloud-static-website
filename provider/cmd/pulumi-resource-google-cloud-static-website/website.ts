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

import { local } from "@pulumi/command";

export interface WebsiteArgs {
    /**
     * The .
     */
    sitePath: string;
    
    /**
     * The .
     */
    indexDocument: string;

    /**
     * The .
     */
    errorDocument: string;

    /**
     * The .
     */
    withCDN: boolean;
}

export class Website extends pulumi.ComponentResource {
    // public readonly resourceGroupName: pulumi.Output<string>;
    public readonly originURL: pulumi.Output<string>
    public readonly cdnURL?: pulumi.Output<string>;
    public readonly customDomainURL?: pulumi.Output<string>;

    private sitePath: string;
    private indexDocument?: string;
    private errorDocument?: string;
    private withCDN: boolean;

    constructor(name: string, args: WebsiteArgs, opts?: pulumi.ComponentResourceOptions) {
        super("google-cloud-static-website:index:Website", name, args, opts);

        this.sitePath = args.sitePath;
        this.indexDocument = args.indexDocument || "index.html";
        this.errorDocument = args.errorDocument || "error.html";
        this.withCDN = args.withCDN;

        // Create a storage bucket for the website.
        const bucket = new gcp.storage.Bucket("my-bucket", {
            location: "US",
            forceDestroy: true,
            website: {
                mainPageSuffix: "index.html",
                notFoundPage: "error.html",
            },
        });

        // Make bucket objects publicly accessible by default.
        const binding = new gcp.storage.BucketIAMBinding("my-bucket-iam-binding", {
            bucket: bucket.name,
            role: "roles/storage.objectViewer",
            members: [
                "allUsers",
            ],
        });

        // Upload the files of the website as managed Pulumi resources.
        const siteRoot = "./site";
        const files = glob.sync(`${siteRoot}/**/*`, { nodir: true });
        files.map(file => {
            const relativePath = file.replace(`${siteRoot}/`, "");
            new gcp.storage.BucketObject(relativePath, {
                bucket: bucket.name,
                name: relativePath,
                source: new pulumi.asset.FileAsset(file),
                contentType: mime.getType(relativePath) || "text/plain",
            });
        });

        this.originURL = pulumi.interpolate`https://storage.googleapis.com/${bucket.name}/index.html`;


        // Create a profile for the CDN.
        if (this.withCDN) {
            
            // Add what's called a "backend bucket"?
            const backendBucket = new gcp.compute.BackendBucket("my-backend-bucket", {
                bucketName: bucket.name,
                enableCdn: true,
            });

            const ip = new gcp.compute.GlobalAddress("address", {
                addressType: "EXTERNAL",
            });

            const map = new gcp.compute.URLMap("map", {
                defaultService: backendBucket.selfLink,
            });

            const proxy = new gcp.compute.TargetHttpProxy("proxy", {
                urlMap: map.selfLink,
            });

            // Add a load balancer.
            const lb = new gcp.compute.GlobalForwardingRule("forwarding-rule", {
                loadBalancingScheme: "EXTERNAL",
                ipAddress: ip.address,
                ipProtocol: "TCP",
                portRange: "80",
                target: proxy.selfLink,
            });

            this.cdnURL = pulumi.interpolate`http://${ip.address}`;

            if (false) {
                

                // this.customDomainURL = cname.fqdn.apply(fqdn => `https://${fqdn.split(".").filter(s => s !== "").join(".")}`);
            }
        }

        // Also export the website's resource group name as a convenience for filtering in the Azure portal.
        // this.resourceGroupName = resourceGroup.name;

        this.registerOutputs({
            originURL: this.originURL,
            cdnURL: this.cdnURL,
            // customDomainURL: this.customDomainURL,
            // resourceGroupName: this.resourceGroupName,
        });
    }
}
