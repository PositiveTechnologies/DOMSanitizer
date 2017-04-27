// DOMSanitizer.

// Links:
// Github: https://github.com/ptresearch/DOMSanitizer

/* global acorn: false, DOMPurify: false, window: false, module: false, define: false */
(function(factory) {
    'use strict';
    var root = typeof window === 'undefined' ? null : window;
    if (typeof define === 'function' && define.amd) {
        define(function() {
            return factory(root);
        });
    } else if (typeof module !== 'undefined') {
        module.exports = factory(root);
    } else {
        root.DOMSanitizer = factory(root);
    }
}(function factory(window) {
    'use strict';

    var DOMSanitizer = function(window) {
        return factory(window);
    };

    DOMSanitizer.version = '0.1.0';

    if (!window || !window.document || window.document.nodeType !== 9 || !acorn || !DOMPurify || !DOMPurify.isSupported) {
        DOMSanitizer.isSupported = false;
        return DOMSanitizer;
    } else {
        DOMSanitizer.isSupported = true;
    }

    var document = window.document;
    var implementation = document.implementation;
    var getElementsByTagName = document.getElementsByTagName;
    var useDOMParser = false;

    
    /* DOMPurify's function to create a config set. */
    var _addToSet = function(set, array) {
        var l = array.length;
        while (l--) {
            set[array[l]] = true;
        }
        return set;
    };

    /* Returned value if injection was found. */
    var CLEAN = '';
    
    /* Default contexts. */
    var DEFAULT_CONTEXTS = ['callback', 'url', 'attr', 'js', 'dom'];

    /* Enabled contexts. */
    var CONTEXTS = null;

    /* Output should be safe for jQuery's $() factory. */
    var SAFE_FOR_JQUERY = true;

    /* Output should be safe for common template engines.
     * This means, DOMPurify removes data attributes, mustaches and ERB.
     */
    var SAFE_FOR_TEMPLATES = true;

    /* Decide if unknown protocols are okay */
    var ALLOW_UNKNOWN_PROTOCOLS = false;

    /* Decide if document with <html>... should be returned in DOMPurify. */
    var WHOLE_DOCUMENT = true;
    
    /* Forbidden AST node types of ESTree */
    var FORBIDDEN_AST_NODES = _addToSet({}, [
        'ArrayPattern', 'ArrowFunctionExpression', 'AssignmentExpression', 'CallExpression',
        'ExportAllDeclaration', 'ExportDefaultDeclaration', 'ExportNamedDeclaration', 'ExportSpecifier',
        'ForOfStatement', 'ForInStatement', 'FunctionDeclaration', 'FunctionExpression',
        'ImportDeclaration', 'ImportDefaultSpecifier', 'ImportNamespaceSpecifier', 'ImportSpecifier',
        'NewExpression', 'ObjectPattern', 'SpreadElement', 'TaggedTemplateExpression',
        'VariableDeclaration', 'WithStatement', 'YieldExpression'
    ]);

    /* Config parsing. */
    var _parseConfig = function(cfg) {
        if (typeof cfg !== 'object') {
            cfg = {};
        }
        // Default true
        SAFE_FOR_JQUERY         = cfg.SAFE_FOR_JQUERY         !== false;
        // Default true
        SAFE_FOR_TEMPLATES      = cfg.SAFE_FOR_TEMPLATES      !== false;
        // Default true
        WHOLE_DOCUMENT          = cfg.WHOLE_DOCUMENT          !== false;
        // Default false
        ALLOW_UNKNOWN_PROTOCOLS = cfg.ALLOW_UNKNOWN_PROTOCOLS || false;

        CONTEXTS = _addToSet({}, cfg.CONTEXTS || DEFAULT_CONTEXTS);
    };

    /* Access to 'obj' via 'path' for writing or reading */
    var _accessByString = function(obj, path, value) {
        path = path.replace(/\[(\w+)\]/g, '.$1');
        path = path.replace(/^\./, '');
        path = path.replace(/\.$/, '');
        var o = obj;
        var pList = path.split('.');
        var len = pList.length;
        for (var i = 0; i < len - 1; i++) {
            var elem = pList[i];
            if (o && elem in o) {
                o = o[elem];
            } else {
                return;
            }
        }
        if (arguments.length === 3) {
            o[pList[len - 1]] = value;
        }
        return o[pList[len - 1]];
    };

    /* Check if an input is JSON */
    var _isJSON = function(s) {
        try {
            var json = JSON.parse(s);
            if (typeof json !== 'object') {
                return false;
            } else {
                return true;
            }
        } catch(e) {
            return false;
        }
    };

    /*
     * _initDocument
     *
     * DOMPurify's implementation to build a HTML document.
     *
     * @param  a string of dirty markup
     * @return a DOM, filled with the dirty markup
     */
    var _initDocument = function(dirty) {
        /* Create a HTML document */
        var doc, body;

        /* Use DOMParser to workaround Firefox bug (see comment below) */
        if (useDOMParser) {
            try {
                doc = new DOMParser().parseFromString(dirty, 'text/html');
            } catch (e) {}
        }

        /* Otherwise use createHTMLDocument, because DOMParser is unsafe in
           Safari (see comment below) */
        if (!doc || !doc.documentElement) {
            doc = implementation.createHTMLDocument('');
            body = doc.body;
            body.parentNode.removeChild(body.parentNode.firstElementChild);
            body.outerHTML = dirty;
        }

        /* Work on whole document or just its body */
        return doc;
    };

    if (DOMPurify.isSupported) {
        (function() {
            var doc = _initDocument('<svg><p><style><img src="</style><img src=x onerror=alert(1)//">');
            if (doc.getElementsByTagName('img')[0].hasAttribute('onerror')) {
                useDOMParser = true;
            }
        }());
    }

    /*
     *  Input normalization funtion.
     *  It supports html entities, octal, hex, and unicode decodings.
     *
     *  @param {string} s - input string.
     *  @return {string} normalized input.
     */
    var _normalizeInput = function(s) {
        var tmp;
        var textArea = document.createElement('textarea');
        do {
            tmp = s;
            textArea.innerHTML = s;
            s = textArea.value;
            try {
                s = decodeURIComponent(s);
            } catch (e) {}
        } while (tmp !== s);
        s = s.replace(/(?:\r\n|\n|\r|\t)/g, '');
        return s;
    };
    
    /* JavaScript tokenizer. */
    var _getJSTokens = function(s) {
        if (s === '') {
            return [''];
        }
        var re = /((['"])(?:(?!\2|\\).|\\(?:\r\n|[\s\S]))*(\2)?|`(?:[^`\\$]|\\[\s\S]|\$(?!\{)|\$\{(?:[^{}]|\{[^}]*\}?)*\}?)*(`)?)|(\/\/.*)|(\/\*(?:[^*]|\*(?!\/))*(\*\/)?)|(\/(?!\*)(?:\[(?:(?![\]\\]).|\\.)*\]|(?![\/\]\\]).|\\.)+\/(?:(?!\s*(?:\b|[\u0080-\uFFFF$\\'"~({]|[+\-!](?!=)|\.?\d))|[gmiyu]{1,5}\b(?![\u0080-\uFFFF$\\]|\s*(?:[+\-*%&|^<>!=?({]|\/(?![\/*])))))|((?:0[xX][\da-fA-F]+|0[oO][0-7]+|0[bB][01]+|(?:\d*\.\d+|\d+\.?)(?:[eE][+-]?\d+)?))|((?!\d)(?:(?!\s)[$\w\u0080-\uFFFF]|\\u[\da-fA-F]{4}|\\u\{[\da-fA-F]{1,6}\})+)|(--|\+\+|&&|\|\||=>|\.{3}|(?:[+\-*\/%&|^]|<{1,2}|>{1,3}|!=?|={1,2})=?|[?:~]|[;,.[\](){}])|(\s+)|(^$|[\s\S])/g;
        var tokens = [];
        var match;
        while ((match = re.exec(s)) != null) {
            tokens.push(match[0]);
        }
        return tokens;
    };
  
    /*
     *  _isJSInjection
     *
     *  @param {string} s - an input string.
     *  @return {boolean} Returns true if input can be parsed and its AST contains dangerous ECMAScript code, otherwise returns false.
     */
    var _isJSInjection = function(s, options) {
        if (typeof options !== 'object') {
            options = {};
        }
        var parseOnce = options.parseOnce || false;
        var forbidden = FORBIDDEN_AST_NODES;
        var ctx, tokens, curToken;
        var isInjection = false;

        /* Define extension for Acorn's function. */
        var checkPolicy = function(node, type) {
            if(forbidden[type]) {
                // Pass expressions like 'a=1' to reduce false positive,
                // but handles expression like 'window.foo = 1', '[window.foo]=1', 'foo = alert(1)', 'foo = function foo(){}'

                // We can not see 'ArrayPattern' node in 'finishNode' function.
                // We see this node as 'ArryExpression' that will be transformed to 'ArrayPattern' in Acorn later.
                if (type === 'AssignmentExpression') {
                    if (node.left.type === 'MemberExpression'  ||
                            node.left.type === 'ArrayPattern'  ||
                            node.left.type === 'ObjectPattern' ||
                            node.left.name === 'location') {
                        isInjection = true;
                        return;
                    }
                    if (node.right.type === 'FunctionExpression' ||
                            node.right.type === 'CallExpression' ||
                            node.right.type === 'MemberExpression') {
                        isInjection = true;
                        return;
                    }
                } else {
                    isInjection = true;
                    return;
                }
            }
        };

        /* Extend default Acorn's methods. */
        acorn.plugins.wafjs = function(parser) {
            parser.extend('finishNode', function(nextMethod) {
                return function(node, type) {
                    checkPolicy(node, type);
                    return nextMethod.call(this, node, type);
                };
            });

            parser.extend('finishNodeAt', function(nextMethod) {
                return function(node, type, pos, loc) {
                    checkPolicy(node, type);
                    return nextMethod.call(this, node, type, pos, loc);
                };
            });
        };
        
        ctx = s;
        // List of tokens.
        tokens = _getJSTokens(ctx);
        // Hard tokens, that can be deleted from string without parsing.
        var hardTokens = ['}', ')', '.', '*', '/'];
        curToken = 0;
        do {
            if (hardTokens.indexOf(ctx[0]) === -1) {
                try {
                    acorn.parse(ctx, {ecmaVersion: 6, allowImportExportEverywhere: true, allowReserved: true, plugins: {wafjs: true}});
                } catch(e) {}
                if (isInjection) {
                    return true;
                }
            }
            // Delete the next token from the context string.
            ctx = ctx.substring(tokens[curToken].length);
            curToken += 1;
        } while(ctx.length > 0 && !parseOnce);
        return false;
    };

    /*
     *  _isJSInjectionInAttr
     *
     *  @param {string} s - an input string.
     *  @return {boolean} Returns true if on* attribute value can be parsed and its AST contains dangerous ECMAScript code, otherwise returns false.
     */
    var _isJSInjectionInAttr = function(s) {
        var doc, body, attributes, name, l, children;
        var value;
        doc = _initDocument(s);
        body = getElementsByTagName.call(doc, 'body')[0];
        children = body.children;
        // In normal case the body should have only 1 child.
        if (children.length !== 1) {
            return true;
        }
        attributes = body.childNodes[0].attributes;
        l = attributes.length;
        while (l--) {
            name = attributes[l].name.toLowerCase();
            if (/^on[a-z]{3,35}/.test(name)) {
                value = attributes[l].value;
                if (_isJSInjection(value, {parseOnce: true})) {
                    return true;
                }
                
                
            }
        }
        return false;
    };

    var _sanitize = Object.create({});

    /*
     *  Sanitization in Callback context.
     *
     *  @param {string} s - input string
     *  @return {string} If s does not contain a valid in DOM function name, returns original string s, otherwise returns empty string.
     */
    _sanitize.callback = function(s) {
        if (typeof _accessByString(window, s) === 'function') {
            return CLEAN;
        }
        return s;
    };

    /*
     * Basic sanitization for URL context.
     * It is hard to imlement full protection here because of peculiarities of data URI parsing in different browsers.
     * See http://blog.kotowicz.net/2012/04/fun-with-data-urls.html
     *     https://github.com/mauro-g/snuck/blob/master/payloads/uri_payloads
     *
     *  @param {string} s - input string.
     *  @return {string} If s does not contain JavaScript patterns, returns original string s, otherwise returns empty string.
     */
    _sanitize.url = function(s) {
        if (s.indexOf(':') === -1) {
            return s;
        }
        var re = /(?:(?:java|vb|j)script:|data:\W*(?:(?:text\/(?:html|xml)|image\/svg\+xml|application\/(?:xml|xhtml\+xml)):?\s*(?:;[\n\t\r ,;]?base64[^\,]*)?,?|,))/i;
        if (re.test(s)) {
            return CLEAN;
        }
        return s;
    };

    /*
     *  Sanitization in JavaScript context.
     *
     *  @param {string} s - an input string.
     *  @return {string} If s does not contain JavaScript patterns, returns original string s, otherwise returns empty string.
     */
    _sanitize.js = function(s) {
        if (!(/['"\=\;\(\)\[\]\{\}\.\`]|(?:export)|(?:import)/.test(s))) {
            return s;
        }
        // Injection index - character after that injected code starts
        var index;

        // "Single quote" context
        index = s.indexOf('\'');
        if (index !== -1 && _isJSInjection(s.slice(index + 1))) {
            return CLEAN;
        }
        // "Double quote" context
        index = s.indexOf('"');
        if (index !== -1 && _isJSInjection(s.slice(index + 1))) {
            return CLEAN;
        }
        // "as-is" context
        if (_isJSInjection(s)) {
            return CLEAN;
        }
        return s;
    };

    /*
     *  Sanitization in HTML/DOM context.
     *
     *  @param {string} s - input string.
     *  @return {string[]} If s does not contain dangerous HTML, returns original string s, overwise returns empty string.
     */
    _sanitize.dom = function(s) {
        /*
         * Add hook to sanitize external protocols (e.g., http, https, ftp, ftps, tel, mailto) as DOMPurify allows them by default.
         * This hook changes scheme in address, thus violating policy.
         */
        DOMPurify.addHook('uponSanitizeAttribute', function(node, data) {
            if (data.attrName === 'href' || data.attrName === 'xlink:href' || data.attrName === 'action') {
                data.attrValue = 'schema://name#';
            }
        });
       /*
        * 'WHOLE_DOCUMENT' should be set to true. The reason is the following:
        * '<script>alert(1)</script>' input will be parsed to
        * '<html><head><script>alert(1)></script></head><body></body></html>'. If 'WHOLE_DOCUMENT' is false
        * then input will be sanitized, bit DOMPurify.removed[] will not contain deleted <script> node.
        *
        * 'SAFE_FOR_TEMPLATES' and 'SAFE_FOR_JQUERY' should be set to true to sanitize data for templates systems and jQuery
        */
        DOMPurify.sanitize(s, {
            WHOLE_DOCUMENT: WHOLE_DOCUMENT,
            SAFE_FOR_TEMPLATES: SAFE_FOR_TEMPLATES,
            SAFE_FOR_JQUERY: SAFE_FOR_JQUERY,
            ALLOW_UNKNOWN_PROTOCOLS: ALLOW_UNKNOWN_PROTOCOLS
        });

        var removed = DOMPurify.removed;
        var removedNode = removed.pop();

        // Process a false positive due to SAFE_TEMPLATES mode if input is JSON.
        // See https://github.com/cure53/DOMPurify/issues/181.
        var inputIsValidJSON = removedNode &&
                removed.length === 0 &&
                'element' in removedNode &&
                removedNode.element.nodeType === 3 &&
                _isJSON(removedNode.element.nodeValue);

        // If DOMPurify has removed a node (DOMPurify.removed.length > 0) then input is dangerous.
        var inputIsDangerous = Boolean(removedNode);

        // Return original s, if input is valid JSON.
        if (inputIsValidJSON) {
            return s;
        }

        // Return clean, if a dangerous HTML was found in input.
        if (inputIsDangerous) {
            return CLEAN;
        }
        return s;
    };

    /*
     *  Sanitization in attribute-based context.
     *
     *  @param {string} s - input string.
     *  @return {string} If s does not contain dangerous JavaScript, returns original string s, overwise returns empty string.
     */
    _sanitize.attr =  function(s) {
        if (!(/['"\=\;\(\)\[\]\{\}\.\`]|(?:export)|(?:import)/.test(s))) {
            return s;
        }
        /*  $ - injection point, {} - injection's edges.
            Example: <img src='$'> -> <img src='{1' onerror='alert(1)}'>.
            Here we create a fake HTML documents based on user's input and find event handlers inside its markup.
            It is injection if on* attribute value is valid JS and contains dangerous JS.

            It is possible to use the following polyglot vector, but tests showed that performance is little changed:
            image = '<img bar="' + s + '"' + ' baz=\'' + s + '\'' +  ' bam=1 ' + s + ' >';
        */
       
        var image;
       
        image = '<img foo="' + s + '" >';
        if (_isJSInjectionInAttr(image)) {
            return CLEAN;
        }
        image = '<img bar=\'' + s +  '\' >';
        if (_isJSInjectionInAttr(image)) {
            return CLEAN;
        }
        image = '<img baz=1 ' + s + ' >';
        if (_isJSInjectionInAttr(image)) {
            return CLEAN;
        }
        
        if (_isJSInjection(s, {parseOnce: true})) {
            return CLEAN;
        }

        return s;
    };

    /*
     *  InjectionContext
     *
     *  @param {string} input - original input string.
     *  @param {string} normalizedInput - normalized input string.
     *  @param {Array} contexts - contexts, where injection was detected.
     */

    function InjectionContext(input, normalizedInput, contexts) {
        this.isInjection = true;
        this.contexts = contexts;
        this.input = input;
        this.normalizedInput = normalizedInput;
    }
    
    /*
     *  isInjection
     *
     *  @param {string} dirty     - input string.
     *  @param {object} options   - configuration object
     *
     *  @return {boolean} `true` if a dirty is injection.
     */
    DOMSanitizer.isInjection = function(dirty, cfg) {
        if (dirty === '') {
            return false;
        }
        if (typeof cfg !== 'object') {
            cfg = {};
        }
        _parseConfig(cfg);
        var normalized = _normalizeInput(dirty);
        var ctx, lctx;
        // eslint-disable-next-line guard-for-in
        for (ctx in CONTEXTS) {
            lctx = ctx.toLowerCase();
            if (lctx in _sanitize && !_sanitize[lctx](normalized)) {
                return true;
            }
        }
        return false;
    };

    /*
     *  getInjectionContext
     *
     *  @param {string} dirty - input string.
     *  @param {object} options - configuration object
     *
     *  @return {InjectionContext|null} The `InjectionContext` object, or `null` if there is no injection.
     */
    DOMSanitizer.getInjectionContext = function(dirty, cfg) {
        if (dirty === '') {
            return null;
        }
        if (typeof cfg !== 'object') {
            cfg = {};
        }
        _parseConfig(cfg);
        var normalized = _normalizeInput(dirty);
        var ctx, lctx;
        var raisedContexts = [];
        // eslint-disable-next-line guard-for-in
        for (ctx in CONTEXTS) {
            lctx = ctx.toLowerCase();
            if (lctx in _sanitize && !_sanitize[lctx](normalized)) {
                raisedContexts.push(lctx);
            }
        }
        if (raisedContexts.length > 0) {
            return new InjectionContext(dirty, normalized, raisedContexts);
        } else {
            return false;
        }
    };

    /*
     *  normalize.
     *  It supports html entities, octal, hex, and unicode decodings.
     *
     *  @param {string} s - input string.
     *
     *  @return {string} normalizad input.
     */
    DOMSanitizer.normalize = _normalizeInput;

    return DOMSanitizer;
}));
