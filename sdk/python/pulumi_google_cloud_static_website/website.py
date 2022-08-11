# coding=utf-8
# *** WARNING: this file was generated by Pulumi SDK Generator. ***
# *** Do not edit by hand unless you're certain you know what you are doing! ***

import warnings
import pulumi
import pulumi.runtime
from typing import Any, Mapping, Optional, Sequence, Union, overload
from . import _utilities

__all__ = ['WebsiteArgs', 'Website']

@pulumi.input_type
class WebsiteArgs:
    def __init__(__self__, *,
                 site_path: pulumi.Input[str],
                 error_document: Optional[pulumi.Input[str]] = None,
                 index_document: Optional[pulumi.Input[str]] = None,
                 with_cdn: Optional[pulumi.Input[bool]] = None):
        """
        The set of arguments for constructing a Website resource.
        :param pulumi.Input[str] site_path: The root directory containing the website's contents.
        :param pulumi.Input[str] error_document: default 404 page
        :param pulumi.Input[str] index_document: The default document for the site. Defaults to index.html
        :param pulumi.Input[bool] with_cdn: Provision CloudFront CDN to serve content.
        """
        pulumi.set(__self__, "site_path", site_path)
        if error_document is not None:
            pulumi.set(__self__, "error_document", error_document)
        if index_document is not None:
            pulumi.set(__self__, "index_document", index_document)
        if with_cdn is not None:
            pulumi.set(__self__, "with_cdn", with_cdn)

    @property
    @pulumi.getter(name="sitePath")
    def site_path(self) -> pulumi.Input[str]:
        """
        The root directory containing the website's contents.
        """
        return pulumi.get(self, "site_path")

    @site_path.setter
    def site_path(self, value: pulumi.Input[str]):
        pulumi.set(self, "site_path", value)

    @property
    @pulumi.getter(name="errorDocument")
    def error_document(self) -> Optional[pulumi.Input[str]]:
        """
        default 404 page
        """
        return pulumi.get(self, "error_document")

    @error_document.setter
    def error_document(self, value: Optional[pulumi.Input[str]]):
        pulumi.set(self, "error_document", value)

    @property
    @pulumi.getter(name="indexDocument")
    def index_document(self) -> Optional[pulumi.Input[str]]:
        """
        The default document for the site. Defaults to index.html
        """
        return pulumi.get(self, "index_document")

    @index_document.setter
    def index_document(self, value: Optional[pulumi.Input[str]]):
        pulumi.set(self, "index_document", value)

    @property
    @pulumi.getter(name="withCDN")
    def with_cdn(self) -> Optional[pulumi.Input[bool]]:
        """
        Provision CloudFront CDN to serve content.
        """
        return pulumi.get(self, "with_cdn")

    @with_cdn.setter
    def with_cdn(self, value: Optional[pulumi.Input[bool]]):
        pulumi.set(self, "with_cdn", value)


class Website(pulumi.ComponentResource):
    @overload
    def __init__(__self__,
                 resource_name: str,
                 opts: Optional[pulumi.ResourceOptions] = None,
                 error_document: Optional[pulumi.Input[str]] = None,
                 index_document: Optional[pulumi.Input[str]] = None,
                 site_path: Optional[pulumi.Input[str]] = None,
                 with_cdn: Optional[pulumi.Input[bool]] = None,
                 __props__=None):
        """
        Create a Website resource with the given unique name, props, and options.
        :param str resource_name: The name of the resource.
        :param pulumi.ResourceOptions opts: Options for the resource.
        :param pulumi.Input[str] error_document: default 404 page
        :param pulumi.Input[str] index_document: The default document for the site. Defaults to index.html
        :param pulumi.Input[str] site_path: The root directory containing the website's contents.
        :param pulumi.Input[bool] with_cdn: Provision CloudFront CDN to serve content.
        """
        ...
    @overload
    def __init__(__self__,
                 resource_name: str,
                 args: WebsiteArgs,
                 opts: Optional[pulumi.ResourceOptions] = None):
        """
        Create a Website resource with the given unique name, props, and options.
        :param str resource_name: The name of the resource.
        :param WebsiteArgs args: The arguments to use to populate this resource's properties.
        :param pulumi.ResourceOptions opts: Options for the resource.
        """
        ...
    def __init__(__self__, resource_name: str, *args, **kwargs):
        resource_args, opts = _utilities.get_resource_args_opts(WebsiteArgs, pulumi.ResourceOptions, *args, **kwargs)
        if resource_args is not None:
            __self__._internal_init(resource_name, opts, **resource_args.__dict__)
        else:
            __self__._internal_init(resource_name, *args, **kwargs)

    def _internal_init(__self__,
                 resource_name: str,
                 opts: Optional[pulumi.ResourceOptions] = None,
                 error_document: Optional[pulumi.Input[str]] = None,
                 index_document: Optional[pulumi.Input[str]] = None,
                 site_path: Optional[pulumi.Input[str]] = None,
                 with_cdn: Optional[pulumi.Input[bool]] = None,
                 __props__=None):
        if opts is None:
            opts = pulumi.ResourceOptions()
        if not isinstance(opts, pulumi.ResourceOptions):
            raise TypeError('Expected resource options to be a ResourceOptions instance')
        if opts.version is None:
            opts.version = _utilities.get_version()
        if opts.id is not None:
            raise ValueError('ComponentResource classes do not support opts.id')
        else:
            if __props__ is not None:
                raise TypeError('__props__ is only valid when passed in combination with a valid opts.id to get an existing resource')
            __props__ = WebsiteArgs.__new__(WebsiteArgs)

            __props__.__dict__["error_document"] = error_document
            __props__.__dict__["index_document"] = index_document
            if site_path is None and not opts.urn:
                raise TypeError("Missing required property 'site_path'")
            __props__.__dict__["site_path"] = site_path
            __props__.__dict__["with_cdn"] = with_cdn
            __props__.__dict__["cdn_url"] = None
            __props__.__dict__["custom_domain_url"] = None
            __props__.__dict__["origin_url"] = None
        super(Website, __self__).__init__(
            'google-cloud-static-website:index:Website',
            resource_name,
            __props__,
            opts,
            remote=True)

    @property
    @pulumi.getter(name="cdnURL")
    def cdn_url(self) -> pulumi.Output[Optional[str]]:
        """
        Blah.
        """
        return pulumi.get(self, "cdn_url")

    @property
    @pulumi.getter(name="customDomainURL")
    def custom_domain_url(self) -> pulumi.Output[Optional[str]]:
        """
        Fixme.
        """
        return pulumi.get(self, "custom_domain_url")

    @property
    @pulumi.getter(name="originURL")
    def origin_url(self) -> pulumi.Output[str]:
        """
        Blah
        """
        return pulumi.get(self, "origin_url")

