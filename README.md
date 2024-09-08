<h1 align="center"> setup-nomad GitHub Action </h1>

<p align="center">
A GitHub Action to install a specific version of HashiCorp Nomad and add it to the PATH
</p>

> [!Warning]
> This project is no longer maintained. For an alternative, please check out: https://github.com/hashicorp/setup-nomad

## Inputs

### `version`

**Required** A version of HashiCorp Nomad to install. Defaults to `latest`.

## Outputs

### `nomad-version`

The version of HashiCorp Nomad that was installed.

## Example usage

```yaml
uses: lucasmelin/setup-nomad@v1
with:
  version: "1.4.3"
```

## Development

Install the dependencies
```bash
$ npm install
```

Build the typescript and package it for distribution
```bash
$ npm run build && npm run package
```

## Publish

```bash
$ npm run package
$ git add dist
$ git commit -a -m "Production dependencies"
$ git push origin releases/v1
```
