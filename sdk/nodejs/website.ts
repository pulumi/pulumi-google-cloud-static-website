// *** WARNING: this file was generated by Pulumi SDK Generator. ***
// *** Do not edit by hand unless you're certain you know what you are doing! ***

import * as pulumi from "@pulumi/pulumi";
import * as utilities from "./utilities";

export class Website extends pulumi.ComponentResource {
    /** @internal */
    public static readonly __pulumiType = 'google-cloud-static-website:index:Website';

    /**
     * Returns true if the given object is an instance of Website.  This is designed to work even
     * when multiple copies of the Pulumi SDK have been loaded into the same process.
     */
    public static isInstance(obj: any): obj is Website {
        if (obj === undefined || obj === null) {
            return false;
        }
        return obj['__pulumiType'] === Website.__pulumiType;
    }

    /**
     * Blah.
     */
    public /*out*/ readonly cdnURL!: pulumi.Output<string | undefined>;
    /**
     * Fixme.
     */
    public /*out*/ readonly customDomainURL!: pulumi.Output<string | undefined>;
    /**
     * Blah
     */
    public /*out*/ readonly originURL!: pulumi.Output<string>;

    /**
     * Create a Website resource with the given unique name, arguments, and options.
     *
     * @param name The _unique_ name of the resource.
     * @param args The arguments to use to populate this resource's properties.
     * @param opts A bag of options that control this resource's behavior.
     */
    constructor(name: string, args: WebsiteArgs, opts?: pulumi.ComponentResourceOptions) {
        let resourceInputs: pulumi.Inputs = {};
        opts = opts || {};
        if (!opts.id) {
            if ((!args || args.sitePath === undefined) && !opts.urn) {
                throw new Error("Missing required property 'sitePath'");
            }
            resourceInputs["errorDocument"] = args ? args.errorDocument : undefined;
            resourceInputs["indexDocument"] = args ? args.indexDocument : undefined;
            resourceInputs["sitePath"] = args ? args.sitePath : undefined;
            resourceInputs["withCDN"] = args ? args.withCDN : undefined;
            resourceInputs["cdnURL"] = undefined /*out*/;
            resourceInputs["customDomainURL"] = undefined /*out*/;
            resourceInputs["originURL"] = undefined /*out*/;
        } else {
            resourceInputs["cdnURL"] = undefined /*out*/;
            resourceInputs["customDomainURL"] = undefined /*out*/;
            resourceInputs["originURL"] = undefined /*out*/;
        }
        opts = pulumi.mergeOptions(utilities.resourceOptsDefaults(), opts);
        super(Website.__pulumiType, name, resourceInputs, opts, true /*remote*/);
    }
}

/**
 * The set of arguments for constructing a Website resource.
 */
export interface WebsiteArgs {
    /**
     * default 404 page
     */
    errorDocument?: pulumi.Input<string>;
    /**
     * The default document for the site. Defaults to index.html
     */
    indexDocument?: pulumi.Input<string>;
    /**
     * The root directory containing the website's contents.
     */
    sitePath: pulumi.Input<string>;
    /**
     * Provision CloudFront CDN to serve content.
     */
    withCDN?: pulumi.Input<boolean>;
}
