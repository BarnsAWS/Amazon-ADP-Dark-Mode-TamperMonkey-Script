// ==UserScript==
// @name         Amazon ADP Dark Mode
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  High-contrast dark mode for my.adp.com — nuclear approach.
//               Color palette: AWS Cloudscape "Polaris Dark Mode" tokens v3.3.
//               Source: AWS Cloudscape/Polaris dark mode (awsui-polaris-dark-mode)
// @author       BarnsAWS
// @match        https://my.adp.com/*
// @match        https://*.adp.com/*
// @grant        GM_addStyle
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    // ═══════════════════════════════════════════════════════════════
    // COLOR CONSTANTS — AWS Cloudscape "Polaris Dark Mode" v3.3
    //   v3.0 → v3.1: --bg-input + inline-control contrast
    //   v3.1 → v3.2: generalized in-content selected rule + inline-white fall-through
    //   v3.2 → v3.3: background-image stripping, sub-component coverage,
    //                tight-loop style observer, lower light threshold (200)
    // ═══════════════════════════════════════════════════════════════

    const SCRIPT_NAME = 'Amazon ADP Dark Mode';
    const STYLE_ID = 'amazon-adp-dark-mode-style';

    // Tokens
    const C = {
        bgInput:    '#0a0f15',
        bgPrimary:  '#161d26',
        bgSecondary:'#1b232d',
        bgTertiary: '#232b37',
        bgElevated: '#424650',
        textPrimary:'#f9f9fa',
        textHeading:'#ebebf0',
        textBody:   '#c6c6cd',
        textMuted:  '#8c8c94',
        textDisabled:'#656871',
        link:       '#42b4ff',
        linkHover:  '#89cbff',
        accentOrange:'#ff9900',
        accentInfoBg:'#001129',
        accentErrorBg:'#1f0000',
        borderDefault:'#424650',
        borderDisabled:'#656871',
    };

    function activateDarkFlag() {
        try {
            if (document.documentElement) {
                document.documentElement.style.colorScheme = 'dark';
                document.documentElement.setAttribute('data-color-scheme', 'dark');
                document.documentElement.setAttribute('data-theme', 'dark');
            }
        } catch (_) { /* noop */ }
    }

    // Source pattern: Amazon AWS Dark Mode Standard v3.3 - Core CSS + Component Rules
    const DARK_CSS = `
    /* ===== NUCLEAR TEXT RESET ===== */
    *:not(svg):not(svg *):not(img):not(video):not(canvas):not(input):not(textarea):not(select) {
        color: #c6c6cd !important;
        -webkit-text-fill-color: #c6c6cd !important;
    }

    * { border-color: #424650 !important; }

    html, body {
        background-color: #161d26 !important;
        color-scheme: dark !important;
    }

    div, section, article, aside, main, footer,
    header, nav, form, fieldset, ul, ol, li,
    table, thead, tbody, tfoot, tr, th, td,
    span, p, h1, h2, h3, h4, h5, h6,
    details, summary, figure, figcaption,
    blockquote, pre, code,
    label, dl, dt, dd {
        background-color: transparent !important;
    }

    h1 { color: #f9f9fa !important; -webkit-text-fill-color: #f9f9fa !important; }
    h2, h3 { color: #ebebf0 !important; -webkit-text-fill-color: #ebebf0 !important; }
    h4, h5, h6 { color: #dedee3 !important; -webkit-text-fill-color: #dedee3 !important; }

    [class*="amount"], [class*="Amount"],
    [class*="total"], [class*="Total"],
    [class*="figure"], [class*="Figure"] {
        color: #f9f9fa !important;
        -webkit-text-fill-color: #f9f9fa !important;
    }

    a, a *, [role="link"], [role="link"] * {
        color: #42b4ff !important;
        -webkit-text-fill-color: #42b4ff !important;
        text-decoration-color: #42b4ff !important;
    }
    a:hover, a:hover *, [role="link"]:hover, [role="link"]:hover * {
        color: #89cbff !important;
        -webkit-text-fill-color: #89cbff !important;
    }

    /* ===== INPUTS / SELECT TRIGGERS (v3.1) ===== */
    input, textarea, select,
    [role="combobox"], [role="spinbutton"],
    [role="textbox"]:not([contenteditable="true"]),
    [class*="select-trigger"], [class*="SelectTrigger"],
    [class*="picker-trigger"], [class*="PickerTrigger"],
    [class*="dropdown-trigger"], [class*="DropdownTrigger"],
    [class*="form-control"], [class*="FormControl"],
    [class*="input-wrapper"], [class*="InputWrapper"],
    [class*="select-field"], [class*="SelectField"],
    [class*="text-field"]:not(label), [class*="TextField"]:not(label),
    [class*="adp-select"], [class*="AdpSelect"],
    [class*="vds-select"], [class*="VdsSelect"],
    [class*="vds-input"], [class*="VdsInput"] {
        background-color: #0a0f15 !important;
        background-image: none !important;
        color: #c6c6cd !important;
        -webkit-text-fill-color: #c6c6cd !important;
        border: 1px solid #656871 !important;
        caret-color: #f9f9fa !important;
    }
    input::placeholder, textarea::placeholder {
        color: #8c8c94 !important;
        -webkit-text-fill-color: #8c8c94 !important;
        opacity: 1 !important;
    }
    input:focus, textarea:focus, select:focus,
    [role="combobox"]:focus,
    [class*="select-trigger"]:focus, [class*="dropdown-trigger"]:focus {
        border-color: #42b4ff !important;
        outline: 2px solid #42b4ff !important;
        outline-offset: 1px !important;
    }

    /* ===== BUTTONS ===== */
    button, input[type="submit"], input[type="button"],
    .btn, [role="button"] {
        background-color: #161d26 !important;
        background-image: none !important;
        color: #42b4ff !important;
        -webkit-text-fill-color: #42b4ff !important;
        border-color: #42b4ff !important;
    }
    button:hover, .btn:hover, [role="button"]:hover {
        background-color: #232b37 !important;
    }

    button[class*="primary"], [class*="variant-primary"],
    button[class*="Primary"], button[type="submit"],
    .btn-primary, [class*="btn-primary"] {
        background-color: #ff9900 !important;
        background-image: none !important;
        color: #0f141a !important;
        -webkit-text-fill-color: #0f141a !important;
        border-color: #ff9900 !important;
        border-radius: 20px !important;
    }
    button[class*="primary"]:hover, [class*="variant-primary"]:hover,
    .btn-primary:hover {
        background-color: #ffac33 !important;
        border-color: #ffac33 !important;
    }

    button:disabled, button[disabled], [class*="disabled"] {
        background-color: #161d26 !important;
        color: #8c8c94 !important;
        -webkit-text-fill-color: #8c8c94 !important;
        border-color: #656871 !important;
    }

    /* ===== CARDS / TILES / WIDGETS ===== */
    [class*="card"], [class*="Card"],
    [class*="tile"], [class*="Tile"],
    [class*="panel"], [class*="Panel"],
    [class*="widget"], [class*="Widget"],
    [class*="vds-card"], [class*="VdsCard"],
    [class*="adp-card"], [class*="AdpCard"],
    [class*="summary"], [class*="Summary"],
    [class*="container"]:not([class*="Container-fluid"]),
    [data-test-component*="Card"] {
        background-color: #1b232d !important;
        background-image: none !important;
        border: 1px solid #424650 !important;
    }

    /* ===== CARD SUB-COMPONENTS (v3.3) =====
       Source pattern: Cloudscape Dark Mode Standard v3.3 - Sub-Component Coverage
       Card-internal headers/titles/bodies/contents/footers inherit transparent so
       the card surface (#1b232d) shows through. Text picks up appropriate tier. */
    [class*="card"] header, [class*="card"] [class*="header"]:not(input):not([class*="page-header"]):not([class*="app-header"]):not([class*="topbar"]),
    [class*="card"] [class*="title"], [class*="card"] [class*="Title"],
    [class*="card"] [class*="head"]:not(input):not([class*="header"]),
    [class*="card"] [class*="body"]:not(input):not(textarea):not(button),
    [class*="card"] [class*="Body"]:not(input):not(textarea):not(button),
    [class*="card"] [class*="content"]:not(input):not(textarea):not(button),
    [class*="card"] [class*="Content"]:not(input):not(textarea):not(button),
    [class*="card"] [class*="footer"]:not(input):not(textarea):not(button),
    [class*="card"] [class*="Footer"]:not(input):not(textarea):not(button),
    [class*="Card"] header, [class*="Card"] [class*="header"]:not(input):not([class*="page-header"]):not([class*="app-header"]):not([class*="topbar"]),
    [class*="Card"] [class*="title"], [class*="Card"] [class*="Title"],
    [class*="Card"] [class*="body"]:not(input):not(textarea):not(button),
    [class*="Card"] [class*="content"]:not(input):not(textarea):not(button),
    [class*="Card"] [class*="footer"]:not(input):not(textarea):not(button),
    [class*="panel"] header, [class*="panel"] [class*="header"]:not(input):not([class*="page-header"]):not([class*="app-header"]):not([class*="topbar"]),
    [class*="panel"] [class*="title"], [class*="panel"] [class*="body"]:not(input):not(textarea):not(button),
    [class*="panel"] [class*="content"]:not(input):not(textarea):not(button),
    [class*="widget"] header, [class*="widget"] [class*="header"]:not(input):not([class*="page-header"]):not([class*="app-header"]):not([class*="topbar"]),
    [class*="widget"] [class*="title"], [class*="widget"] [class*="body"]:not(input):not(textarea):not(button),
    [class*="widget"] [class*="content"]:not(input):not(textarea):not(button),
    [class*="vds-card"] header, [class*="vds-card"] [class*="title"], [class*="vds-card"] [class*="body"]:not(input):not(textarea):not(button),
    [class*="vds-card"] [class*="content"]:not(input):not(textarea):not(button),
    [class*="vds-card"] [class*="footer"]:not(input):not(textarea):not(button),
    [class*="adp-card"] header, [class*="adp-card"] [class*="title"], [class*="adp-card"] [class*="body"]:not(input):not(textarea):not(button),
    [class*="adp-card"] [class*="content"]:not(input):not(textarea):not(button),
    [class*="container"] [class*="title"]:not(input),
    [class*="container"] [class*="header"]:not(input):not([class*="page-header"]):not([class*="app-header"]):not([class*="topbar"]) {
        background-color: transparent !important;
        background-image: none !important;
    }
    /* Sub-component text colors */
    [class*="card"] [class*="title"], [class*="card"] [class*="Title"],
    [class*="Card"] [class*="title"], [class*="Card"] [class*="Title"],
    [class*="panel"] [class*="title"], [class*="widget"] [class*="title"],
    [class*="vds-card"] [class*="title"], [class*="adp-card"] [class*="title"] {
        color: #ebebf0 !important;                  /* --text-heading */
        -webkit-text-fill-color: #ebebf0 !important;
    }
    [class*="card"] [class*="body"], [class*="Card"] [class*="body"],
    [class*="card"] [class*="content"], [class*="Card"] [class*="content"],
    [class*="panel"] [class*="body"], [class*="panel"] [class*="content"],
    [class*="widget"] [class*="body"], [class*="widget"] [class*="content"],
    [class*="vds-card"] [class*="body"], [class*="vds-card"] [class*="content"],
    [class*="adp-card"] [class*="body"], [class*="adp-card"] [class*="content"] {
        color: #c6c6cd !important;                  /* --text-body */
        -webkit-text-fill-color: #c6c6cd !important;
    }

    /* ===== TABLES ===== */
    table, th, td, tr {
        background-color: #1b232d !important;
        border-color: #424650 !important;
    }
    tr:nth-child(even), [role="row"]:nth-child(even),
    [role="listitem"]:nth-child(even),
    [class*="list-row"]:nth-child(even),
    [class*="ListRow"]:nth-child(even),
    [class*="row-item"]:nth-child(even),
    [class*="RowItem"]:nth-child(even) {
        background-color: #232b37 !important;
    }
    th, [role="columnheader"] {
        background-color: #232b37 !important;
        color: #ebebf0 !important;
        -webkit-text-fill-color: #ebebf0 !important;
    }
    tr:hover, [role="row"]:hover, [role="listitem"]:hover,
    [class*="list-row"]:hover, [class*="row-item"]:hover {
        background-color: #232b37 !important;
    }

    /* ===== MODALS / MENUS / DROPDOWN-MENUS / POPOVERS ===== */
    [role="dialog"], [role="menu"], [role="listbox"], [role="tooltip"],
    [class*="modal"], [class*="Modal"],
    [class*="overlay"], [class*="Overlay"],
    [class*="popup"], [class*="Popup"],
    [class*="popover"], [class*="Popover"],
    [class*="menu"]:not([class*="menu-trigger"]):not([class*="menu-button"]),
    [class*="Menu"]:not([class*="MenuTrigger"]):not([class*="MenuButton"]),
    [class*="dropdown"]:not([class*="dropdown-trigger"]),
    [class*="Dropdown"]:not([class*="DropdownTrigger"]),
    [class*="tooltip"], [class*="Tooltip"] {
        background-color: #1b232d !important;
        background-image: none !important;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.6) !important;
    }
    [role="menuitem"]:hover { background-color: #232b37 !important; }

    /* ===== SIDEBAR / NAV ===== */
    aside, [class*="sidebar"], [class*="Sidebar"],
    [class*="side-nav"], [class*="SideNav"],
    [class*="left-nav"], [class*="LeftNav"],
    [class*="navigation"]:not([class*="top"]):not([class*="Top"]) {
        background-color: #161d26 !important;
        background-image: none !important;
        border-right: 1px solid #424650 !important;
    }
    aside *, [class*="sidebar"] *, [class*="side-nav"] *,
    [class*="left-nav"] * {
        background-color: transparent !important;
    }
    aside [role="menuitem"]:hover, aside li:hover,
    [class*="sidebar"] [role="menuitem"]:hover, [class*="sidebar"] li:hover,
    [class*="side-nav"] [role="menuitem"]:hover, [class*="side-nav"] li:hover,
    [class*="left-nav"] [role="menuitem"]:hover, [class*="left-nav"] li:hover {
        background-color: #1b232d !important;
    }

    /* ===== TOP BAR ===== */
    [class*="topbar"], [class*="TopBar"],
    [class*="top-navigation"], [class*="TopNavigation"],
    [class*="masthead"], [class*="Masthead"],
    [class*="app-header"], [class*="AppHeader"],
    [class*="global-header"], [class*="GlobalHeader"],
    body > header, body > div > header {
        background-color: #161d26 !important;
        background-image: none !important;
        border-bottom-color: #424650 !important;
    }

    /* ===== BANNERS / ALERTS ===== */
    [role="alert"], [class*="banner"], [class*="Banner"],
    [class*="notice"], [class*="Notice"] {
        background-color: #001129 !important;
        background-image: none !important;
        color: #c6c6cd !important;
        -webkit-text-fill-color: #c6c6cd !important;
        border-color: #42b4ff !important;
        border-radius: 12px !important;
    }
    [role="alert"][class*="error"], [class*="alert-error"], [class*="error-banner"] {
        background-color: #1f0000 !important;
        border-color: #ff7a7a !important;
    }

    /* ===== TABS — bottom-border underline ===== */
    [role="tab"] {
        color: #8c8c94 !important;
        -webkit-text-fill-color: #8c8c94 !important;
    }
    [role="tab"][aria-selected="true"], [role="tab"][aria-current="true"] {
        background-color: transparent !important;
        background-image: none !important;
        color: #f9f9fa !important;
        -webkit-text-fill-color: #f9f9fa !important;
        border-left: none !important;
        border-right: none !important;
        border-top: none !important;
        border-bottom: 2px solid #42b4ff !important;
    }

    /* ===== LISTBOX OPTIONS ===== */
    [role="option"]:hover { background-color: #232b37 !important; }
    [role="option"][aria-selected="true"] {
        background-color: #232b37 !important;
        background-image: none !important;
        color: #f9f9fa !important;
        -webkit-text-fill-color: #f9f9fa !important;
        border-left: none !important;
    }

    /* ===== SELECTED — IN-CONTENT (v3.2) ===== */
    [aria-selected="true"]:not([role="tab"]):not([role="option"]),
    [aria-current="true"]:not([role="tab"]),
    [aria-current="page"]:not([role="tab"]),
    [aria-current="step"]:not([role="tab"]),
    [aria-current="location"]:not([role="tab"]),
    [class*="selected"]:not(button):not(input):not(label):not([role="tab"]):not([role="option"]),
    [class*="-active"]:not(button):not(input):not([role="tab"]):not([class*="-inactive"]),
    [class*="is-active"]:not(button):not(input):not([role="tab"]),
    [class*="is-selected"]:not(button):not(input):not([role="tab"]) {
        background-color: #001129 !important;
        background-image: none !important;
        color: #f9f9fa !important;
        -webkit-text-fill-color: #f9f9fa !important;
        border-left: 3px solid #42b4ff !important;
        border-right: none !important;
        border-top: none !important;
        border-bottom: none !important;
    }
    [aria-selected="true"]:not([role="tab"]):not([role="option"]) *:not(svg):not(svg *),
    [aria-current="true"]:not([role="tab"]) *:not(svg):not(svg *),
    [aria-current="page"]:not([role="tab"]) *:not(svg):not(svg *),
    [class*="selected"]:not([role="tab"]):not([role="option"]) *:not(svg):not(svg *):not(button):not(input),
    [class*="-active"]:not([role="tab"]) *:not(svg):not(svg *):not(button):not(input),
    [class*="is-active"]:not([role="tab"]) *:not(svg):not(svg *):not(button):not(input),
    [class*="is-selected"]:not([role="tab"]) *:not(svg):not(svg *):not(button):not(input) {
        background-color: transparent !important;
        background-image: none !important;
        color: #f9f9fa !important;
        -webkit-text-fill-color: #f9f9fa !important;
    }

    /* ===== SELECTED — SIDEBAR NAV ===== */
    aside [aria-selected="true"], aside [aria-current="true"], aside [aria-current="page"],
    aside [class*="selected"]:not(button):not(input),
    aside [class*="active"]:not(button):not(input),
    [class*="sidebar"] [aria-selected="true"], [class*="sidebar"] [aria-current="true"],
    [class*="sidebar"] [aria-current="page"],
    [class*="sidebar"] [class*="selected"]:not(button):not(input),
    [class*="sidebar"] [class*="active"]:not(button):not(input),
    [class*="side-nav"] [aria-selected="true"], [class*="side-nav"] [aria-current="true"],
    [class*="side-nav"] [aria-current="page"],
    [class*="side-nav"] [class*="selected"]:not(button):not(input),
    [class*="side-nav"] [class*="active"]:not(button):not(input),
    [class*="left-nav"] [aria-selected="true"], [class*="left-nav"] [aria-current="true"],
    [class*="left-nav"] [aria-current="page"],
    [class*="left-nav"] [class*="selected"]:not(button):not(input),
    [class*="left-nav"] [class*="active"]:not(button):not(input),
    nav[aria-label] [aria-current="page"],
    nav[aria-label] [aria-selected="true"] {
        background-color: #0a0f15 !important;
        background-image: none !important;
        color: #f9f9fa !important;
        -webkit-text-fill-color: #f9f9fa !important;
        border-left: 4px solid #42b4ff !important;
    }

    /* ===== BADGES / PILLS ===== */
    [class*="badge"], [class*="Badge"],
    [class*="chip"], [class*="Chip"],
    [class*="pill"], [class*="Pill"],
    [class*="tag"]:not(label), [class*="Tag"]:not(label) {
        background-color: #232b37 !important;
        background-image: none !important;
        color: #c6c6cd !important;
        -webkit-text-fill-color: #c6c6cd !important;
        border-radius: 4px !important;
    }
    [class*="badge"][class*="success"], [class*="status-success"] {
        background-color: #00802f !important;
        color: #f9f9fa !important;
        -webkit-text-fill-color: #f9f9fa !important;
    }
    [class*="badge"][class*="error"], [class*="status-error"] {
        background-color: #5a0000 !important;
        color: #ff7a7a !important;
        -webkit-text-fill-color: #ff7a7a !important;
    }

    /* ===== BREADCRUMBS ===== */
    [class*="breadcrumb"] a, [class*="breadcrumb"] [role="link"] {
        color: #42b4ff !important;
        -webkit-text-fill-color: #42b4ff !important;
    }
    [class*="breadcrumb"] span:not([role="link"]),
    [class*="breadcrumb"] [class*="last"] {
        color: #8c8c94 !important;
        -webkit-text-fill-color: #8c8c94 !important;
    }

    /* ===== INLINE STYLE OVERRIDES (v3.2 + v3.3 background-image) ===== */
    [style*="color: rgb(0, 0, 0)"],
    [style*="color:rgb(0,0,0)"],
    [style*="color: black"],
    [style*="color:#000"],
    [style*="color: #000"] {
        color: #c6c6cd !important;
        -webkit-text-fill-color: #c6c6cd !important;
    }
    [style*="background-color: rgb(255, 255, 255)"],
    [style*="background-color: rgba(255, 255, 255"],
    [style*="background-color: white"],
    [style*="background:#fff"],
    [style*="background: #fff"],
    [style*="background:#ffffff"],
    [style*="background: #ffffff"],
    [style*="background: white"],
    [style*="background-color:#fff"],
    [style*="background-color: #fff"],
    [style*="background-color:#ffffff"],
    [style*="background-color: #ffffff"] {
        background-color: #1b232d !important;
        background-image: none !important;
    }
    [style*="background-color: rgb(245"],
    [style*="background-color: rgb(248"],
    [style*="background-color: rgb(250"],
    [style*="background-color: rgb(252"],
    [style*="background-color: rgb(247"] {
        background-color: #1b232d !important;
        background-image: none !important;
    }
    [style*="background-color: rgb(240"],
    [style*="background-color: rgb(235"],
    [style*="background-color: rgb(230"],
    [style*="background-color: rgb(225"],
    [style*="background-color: rgb(220"] {
        background-color: #232b37 !important;
        background-image: none !important;
    }
    /* v3.3: kill inline gradients that contain white */
    [style*="linear-gradient"][style*="white"],
    [style*="linear-gradient"][style*="#fff"],
    [style*="linear-gradient"][style*="rgb(255"],
    [style*="background-image"][style*="white"],
    [style*="background-image"][style*="#fff"],
    [style*="background-image"][style*="rgb(255"] {
        background-image: none !important;
        background-color: #1b232d !important;
    }
    [style*="rgba(151"], [style*="rgba(155"], [style*="rgba(146"],
    [style*="rgba(160"], [style*="rgba(170"] {
        background-color: #001129 !important;
    }

    /* ===== MEDIA: HANDS OFF ===== */
    img, video, canvas, picture {
        background-color: transparent !important;
        filter: none !important;
    }
    svg, svg * {
        /* preserve chart fills/strokes verbatim */
    }

    /* ===== SCROLLBARS ===== */
    ::-webkit-scrollbar { width: 10px; height: 10px; background: #161d26; }
    ::-webkit-scrollbar-track { background: #161d26; }
    ::-webkit-scrollbar-thumb { background: #424650; border-radius: 5px; }
    ::-webkit-scrollbar-thumb:hover { background: #656871; }
    * { scrollbar-color: #424650 #161d26; scrollbar-width: thin; }
    `;

    function log() {
        try {
            var args = Array.prototype.slice.call(arguments);
            args.unshift('[' + SCRIPT_NAME + ']');
            console.debug.apply(console, args);
        } catch (_) { /* noop */ }
    }

    function injectGlobalCSS() {
        if (document.getElementById(STYLE_ID)) return;
        var style = document.createElement('style');
        style.id = STYLE_ID;
        style.type = 'text/css';
        style.textContent = DARK_CSS;
        var target = document.head || document.documentElement;
        if (target) target.appendChild(style);
        if (typeof GM_addStyle !== 'undefined') {
            try { GM_addStyle(DARK_CSS); } catch (e) { log('GM_addStyle failed:', e && e.message); }
        }
    }

    // Source pattern: Cloudscape Dark Mode Standard v3.3 - Light-Surface Detector
    // Returns true if computed styles indicate this element is painting a LIGHT surface
    // (either a light background-color OR a background-image gradient containing
    // white / near-white stops). Used by enforceDarkSurfaces() and nuclearDarkMode().
    function isLightSurface(computed) {
        if (!computed) return { isLight: false, lum: 0, isImage: false };
        var bg = computed.backgroundColor;
        var bgImage = computed.backgroundImage;

        // Check background-color
        var m = bg && bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
        if (m) {
            var r = parseInt(m[1], 10);
            var g = parseInt(m[2], 10);
            var b = parseInt(m[3], 10);
            var a = m[4] !== undefined ? parseFloat(m[4]) : 1;
            if (a > 0.05) {
                var lum = r * 0.299 + g * 0.587 + b * 0.114;
                if (lum > 100) return { isLight: true, lum: lum, isImage: false };
            }
        }

        // Check background-image for white/near-white stops in gradients
        if (bgImage && bgImage !== 'none') {
            // Look for any rgb triplet >= (200, 200, 200), or named "white", or "#fff"/"#ffffff"
            if (/\bwhite\b/i.test(bgImage) ||
                /#fff\b/i.test(bgImage) || /#ffffff\b/i.test(bgImage) ||
                /#fefefe\b/i.test(bgImage) || /#f8f8f8\b/i.test(bgImage)) {
                return { isLight: true, lum: 240, isImage: true };
            }
            var rgbStops = bgImage.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/g);
            if (rgbStops) {
                for (var i = 0; i < rgbStops.length; i++) {
                    var rm = rgbStops[i].match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
                    if (rm) {
                        var rr = parseInt(rm[1], 10), gg = parseInt(rm[2], 10), bb = parseInt(rm[3], 10);
                        var slum = rr * 0.299 + gg * 0.587 + bb * 0.114;
                        if (slum > 200) return { isLight: true, lum: slum, isImage: true };
                    }
                }
            }
        }
        return { isLight: false, lum: 0, isImage: false };
    }

    // Source pattern: Cloudscape Dark Mode Standard v3.3 - Aggressive Surface Enforcement
    // Forces a dark surface on any element whose computed style paints a light bg
    // (whether via background-color or a gradient). Strips background-image when
    // gradients contain white. Routes by luminance bucket to secondary/tertiary.
    function enforceDarkSurfaces(root) {
        var scope = root || document;
        var all;
        try { all = scope.querySelectorAll('*'); } catch (_) { return; }
        for (var i = 0; i < all.length; i++) {
            var el = all[i];
            var tag = el.tagName ? el.tagName.toUpperCase() : '';
            if (tag === 'IMG' || tag === 'VIDEO' || tag === 'CANVAS' || tag === 'SVG' ||
                tag === 'PATH' || tag === 'CIRCLE' || tag === 'RECT' || tag === 'POLYGON' ||
                tag === 'LINE' || tag === 'POLYLINE' || tag === 'ELLIPSE' || tag === 'G' ||
                tag === 'DEFS' || tag === 'USE' || tag === 'SYMBOL' || tag === 'CLIPPATH' ||
                tag === 'MASK' || tag === 'TEXT' || tag === 'TSPAN') continue;
            if (el.closest && el.closest('svg')) continue;

            var computed;
            try { computed = window.getComputedStyle(el); } catch (_) { continue; }
            var info = isLightSurface(computed);
            if (!info.isLight) continue;

            // Strip light background-image
            if (info.isImage) {
                try { el.style.setProperty('background-image', 'none', 'important'); } catch (_) {}
            }

            // Pick target surface by luminance
            var target;
            if (info.lum > 240) target = '#1b232d';        // pure white → secondary (card)
            else if (info.lum > 200) target = '#1b232d';   // off-white → secondary
            else if (info.lum > 140) target = '#1b232d';   // light gray → secondary
            else target = '#232b37';                        // medium gray → tertiary

            try { el.style.setProperty('background-color', target, 'important'); } catch (_) {}

            // Fix dark text on now-dark surface
            var color = computed.color;
            var cm = color && color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
            if (cm) {
                var cr = parseInt(cm[1], 10), cg = parseInt(cm[2], 10), cb = parseInt(cm[3], 10);
                var cLum = cr * 0.299 + cg * 0.587 + cb * 0.114;
                if (cLum < 100) {
                    var isLink = (tag === 'A') || (el.closest && el.closest('a, [role="link"]'));
                    if (isLink) {
                        try {
                            el.style.setProperty('color', '#42b4ff', 'important');
                            el.style.setProperty('-webkit-text-fill-color', '#42b4ff', 'important');
                        } catch (_) {}
                    } else {
                        try {
                            el.style.setProperty('color', '#c6c6cd', 'important');
                            el.style.setProperty('-webkit-text-fill-color', '#c6c6cd', 'important');
                        } catch (_) {}
                    }
                }
            }
        }
    }

    // Source pattern: Amazon AWS Dark Mode Standard v3.3 - JS Nuclear Pass
    // Now uses the shared isLightSurface() helper and lower threshold (200).
    function nuclearDarkMode() {
        enforceDarkSurfaces(document);
    }

    function forceTopBarDark() {
        var topSelectors = 'body > div:first-child, body > header, body > nav, ' +
            '[id*="header"], [class*="header"], [class*="navbar"], [class*="topbar"], ' +
            '[class*="masthead"], [class*="app-header"]';
        document.querySelectorAll(topSelectors).forEach(function(el) {
            try {
                el.style.setProperty('background-color', '#161d26', 'important');
                el.style.setProperty('background-image', 'none', 'important');
            } catch (_) {}
        });

        document.querySelectorAll('div, header, nav, ul').forEach(function(el) {
            var pos, top, h;
            try {
                pos = window.getComputedStyle(el).position;
                top = el.getBoundingClientRect().top;
                h = el.offsetHeight;
            } catch (_) { return; }
            if ((pos === 'fixed' || pos === 'sticky' || pos === 'absolute') && top < 100) {
                el.style.setProperty('background-color', '#161d26', 'important');
                el.style.setProperty('background-image', 'none', 'important');
            }
            if (top >= 0 && top < 80 && h > 20 && h < 100) {
                var elBg;
                try { elBg = window.getComputedStyle(el).backgroundColor; } catch (_) { return; }
                var m = elBg && elBg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
                if (m) {
                    var l = parseInt(m[1], 10) * 0.299 + parseInt(m[2], 10) * 0.587 + parseInt(m[3], 10) * 0.114;
                    if (l > 50) {
                        el.style.setProperty('background-color', '#161d26', 'important');
                        el.style.setProperty('background-image', 'none', 'important');
                    }
                }
            }
        });
    }

    function forceInlineControlsDark() {
        var sel = 'input, textarea, select, [role="combobox"], [role="textbox"], ' +
                  '[class*="select-trigger"], [class*="dropdown-trigger"], ' +
                  '[class*="form-control"], [class*="select-field"], ' +
                  '[class*="vds-select"], [class*="vds-input"], [class*="adp-select"]';
        document.querySelectorAll(sel).forEach(function(el) {
            try {
                el.style.setProperty('background-color', '#0a0f15', 'important');
                el.style.setProperty('background-image', 'none', 'important');
                el.style.setProperty('border', '1px solid #656871', 'important');
                el.style.setProperty('color', '#c6c6cd', 'important');
                el.style.setProperty('-webkit-text-fill-color', '#c6c6cd', 'important');
            } catch (_) {}
        });
    }

    function forceSelectedRowsDark() {
        var sel = '[aria-selected="true"]:not([role="tab"]):not([role="option"]), ' +
                  '[aria-current="true"]:not([role="tab"]), ' +
                  '[aria-current="page"]:not([role="tab"]), ' +
                  '[class*="selected"]:not(button):not(input):not(label):not([role="tab"]):not([role="option"]), ' +
                  '[class*="is-active"]:not(button):not(input):not([role="tab"]), ' +
                  '[class*="is-selected"]:not(button):not(input):not([role="tab"])';
        document.querySelectorAll(sel).forEach(function(el) {
            if (el.closest && el.closest('aside, [class*="sidebar"], [class*="side-nav"], [class*="left-nav"], nav[aria-label]')) {
                try {
                    el.style.setProperty('background-color', '#0a0f15', 'important');
                    el.style.setProperty('background-image', 'none', 'important');
                    el.style.setProperty('border-left', '4px solid #42b4ff', 'important');
                    el.style.setProperty('color', '#f9f9fa', 'important');
                    el.style.setProperty('-webkit-text-fill-color', '#f9f9fa', 'important');
                } catch (_) {}
                return;
            }
            try {
                el.style.setProperty('background-color', '#001129', 'important');
                el.style.setProperty('background-image', 'none', 'important');
                el.style.setProperty('border-left', '3px solid #42b4ff', 'important');
                el.style.setProperty('color', '#f9f9fa', 'important');
                el.style.setProperty('-webkit-text-fill-color', '#f9f9fa', 'important');
            } catch (_) {}
        });
    }

    function pierceShadowRoots(root) {
        if (!root || !root.querySelectorAll) return;
        var hosts;
        try { hosts = root.querySelectorAll('*'); } catch (_) { return; }
        for (var i = 0; i < hosts.length; i++) {
            var host = hosts[i];
            if (host.shadowRoot) {
                try {
                    if (!host.shadowRoot.getElementById(STYLE_ID + '-shadow')) {
                        var s = document.createElement('style');
                        s.id = STYLE_ID + '-shadow';
                        s.textContent = DARK_CSS;
                        host.shadowRoot.appendChild(s);
                    }
                    // Also enforce surfaces inside shadow roots (v3.3)
                    enforceDarkSurfaces(host.shadowRoot);
                } catch (_) { /* closed shadow root */ }
            }
        }
    }

    // Source pattern: Cloudscape Dark Mode Standard v3.3 - Tight-Loop Style Observer
    // Watches inline `style` attribute changes and fixes the affected element
    // immediately (within ~16ms), beating frameworks that write style.background
    // on focus/blur/hover/resize. Runs in addition to (not instead of) the main
    // 250ms debounced observer.
    function attachTightStyleObserver() {
        if (window.__darkModeTightObserver) return;
        var pending = new Set();
        var rafId = null;
        function flush() {
            rafId = null;
            pending.forEach(function(el) {
                if (!el || !el.isConnected) return;
                var tag = el.tagName ? el.tagName.toUpperCase() : '';
                if (tag === 'IMG' || tag === 'VIDEO' || tag === 'CANVAS' || tag === 'SVG' ||
                    (el.closest && el.closest('svg'))) return;
                var computed;
                try { computed = window.getComputedStyle(el); } catch (_) { return; }
                var info = isLightSurface(computed);
                if (!info.isLight) return;
                if (info.isImage) {
                    try { el.style.setProperty('background-image', 'none', 'important'); } catch (_) {}
                }
                var target = info.lum > 140 ? '#1b232d' : '#232b37';
                try { el.style.setProperty('background-color', target, 'important'); } catch (_) {}
            });
            pending.clear();
        }
        var obs = new MutationObserver(function(mutations) {
            for (var i = 0; i < mutations.length; i++) {
                var m = mutations[i];
                if (m.type === 'attributes' && m.target) {
                    pending.add(m.target);
                }
            }
            if (rafId === null && pending.size > 0) {
                rafId = requestAnimationFrame(flush);
            }
        });
        try {
            obs.observe(document.documentElement, {
                attributes: true,
                attributeFilter: ['style'],
                subtree: true
            });
            window.__darkModeTightObserver = obs;
        } catch (_) { /* noop */ }
    }

    function init() {
        log('Initializing v1.3 (Cloudscape v3.3 sub-component coverage + bg-image stripping + tight observer)');
        activateDarkFlag();
        injectGlobalCSS();
        nuclearDarkMode();
        forceTopBarDark();
        forceInlineControlsDark();
        forceSelectedRowsDark();
        pierceShadowRoots(document);
        attachTightStyleObserver();

        var observer = new MutationObserver(function() {
            clearTimeout(observer._t);
            observer._t = setTimeout(function() {
                activateDarkFlag();
                nuclearDarkMode();
                forceTopBarDark();
                forceInlineControlsDark();
                forceSelectedRowsDark();
                pierceShadowRoots(document);
            }, 250);
        });

        try {
            observer.observe(document.body || document.documentElement, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['class', 'aria-selected', 'aria-current', 'data-state', 'data-active', 'data-selected']
            });
        } catch (e) {
            log('Observer attach failed:', e && e.message);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init, { once: true });
    } else {
        init();
    }

    window.addEventListener('load', function() {
        setTimeout(function() { nuclearDarkMode(); forceTopBarDark(); forceInlineControlsDark(); forceSelectedRowsDark(); pierceShadowRoots(document); }, 500);
        setTimeout(function() { nuclearDarkMode(); forceTopBarDark(); forceInlineControlsDark(); forceSelectedRowsDark(); pierceShadowRoots(document); }, 1500);
        setTimeout(function() { nuclearDarkMode(); forceTopBarDark(); forceInlineControlsDark(); forceSelectedRowsDark(); pierceShadowRoots(document); }, 3000);
    });
})();
