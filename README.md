# DOMSanitizer
DOMSanitizer is a client-side web application firewall (WAF) module written in JavaScript and protecting against Cross-Site Scripting (XSS) attacks in black-box model.
 
## Security Goals
* Reducing web application attacks surface on a client-side
* DOM-based XSS attacks detection


## Description
DOMSanitizer is intended for use in WAF solutions and as any other WAF it operates in a black-box model.
If you are web application developer and you control application's data flows, then you probaly should use [DOMPurify](https://github.com/cure53/DOMPurify).
 
DOMSanitizer is based on the following components:
* [DOMPurify](https://github.com/cure53/DOMPurify)
* [Acorn parser](https://github.com/ternjs/acorn)
 
DOMSanitizer uses [DOMPurify](https://github.com/cure53/DOMPurify) sanitizer for detection dangerous HTML, MathML and SVG markup and [Acorn](https://github.com/ternjs/acorn) 
parser for heuristic finding code in data flows.
It can be used in all modern browsers where `DOMPurify` and `Acorn` must work: Safari, Opera (15+), Internet Explorer (10+), Edge, Firefox and Chrome.


## API

```
DOMSanitizer.sanitize(dirty, {contexts: ['js', 'dom']});
```
 
## Examples

```
// Common sanitization.
DOMSanitizer.sanitize('"};alert(1);//"')
// Returns ''


// Sanitization is a JavaScript-context.
DOMSanitizer.sanitize('"};alert(1);//"', {contexts: ['js']})
// Returns ''


// Sanitization is a DOM-context (custom DOMPurify-mode).
DOMSanitizer.sanitize('<script>alert(1)</script>', {contexts: ['dom']})
// Returns ''

// Sanitization is a attribute-based context.
DOMSanitizer.sanitize(' " onmouseover=alert(1) "', {contexts: ['attr']})
// Returns ''
```

## Contexts

DOMSanitizer supports the following contexts: `DOM`, `ATTR`, `URL`, `CALLBACK`, `JS`.
 
## Contributors
* [Arseny Reutov](https://twitter.com/ru_raz0r)
* [Denis Kolegov](https://twitter.com/dnkolegov)

## References
1. [Waf.js: How to Protect Web Applications using JavaScript](http://www.slideshare.net/DenisKolegov/wafjs-how-to-protect-web-applications-using-javascript).
