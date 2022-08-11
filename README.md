# pulumi-google-cloud-static-website

Still very much 🚧 👷.

## Usage

```typescript
import { Website } from "@pulumi/google-cloud-static-website";

const site = new Website("site", {
    sitePath: "./site",
});

export const { originURL } = site;
```

```yaml
name: my-website
runtime: yaml
description: A static website built with pulumi-google-cloud-static-website.

resources:
  site:
    type: google-cloud-static-website:index:Website
    properties:
      sitePath: ./site

outputs:
  originURL: ${site.originURL}
```
