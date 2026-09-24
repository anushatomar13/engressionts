import os
import sys

# Add source directory to python path for autodoc
sys.path.insert(0, os.path.abspath("../src"))

project = "engressionts"
copyright = "2026, Anusha Tomar, Rajdeep Pathak, and Tanujit Chakraborty"
author = "Anusha Tomar, Rajdeep Pathak, and Tanujit Chakraborty"
release = "0.1.0"

# -- General configuration ---------------------------------------------------
extensions = [
    "sphinx.ext.autodoc",
    "sphinx.ext.napoleon",
    "sphinx.ext.viewcode",
    "sphinx.ext.intersphinx",
    "myst_parser",
    "sphinx_copybutton",
]

# MyST settings for Markdown support
myst_enable_extensions = [
    "colon_fence",
    "fieldlist",
    "deflist",
]
source_suffix = {
    ".rst": "restructuredtext",
    ".md": "markdown",
}
master_doc = "index"

# -- Options for HTML output -------------------------------------------------
html_theme = "furo"
html_title = f"{project} {release} documentation"

# Static files (css, logos)
html_static_path = ["_static"]
html_css_files = ["custom.css"]

html_theme_options = {
    "sidebar_hide_name": False,
    "navigation_with_keys": True,
    "light_css_variables": {
        "color-brand-primary": "#0d9488",
        "color-brand-content": "#0284c7",
        "color-sidebar-background": "#f0fdf4",
        "color-sidebar-link-text": "#0f766e",
    },
    "dark_css_variables": {
        "color-brand-primary": "#2dd4bf",
        "color-brand-content": "#38bdf8",
        "color-sidebar-background": "#042f2e",
        "color-sidebar-link-text": "#5eead4",
    },
}

# Napoleon settings for parsing Google/NumPy docstrings
napoleon_google_docstring = True
napoleon_numpy_docstring = True
napoleon_include_init_with_doc = True
napoleon_use_param = True
napoleon_use_rtype = True

# Autodoc settings
autodoc_default_options = {
    "members": True,
    "member-order": "bysource",
    "special-members": "__init__",
    "undoc-members": True,
    "exclude-members": "__weakref__",
}
autodoc_typehints = "description"

# Intersphinx mapping
intersphinx_mapping = {
    "python": ("https://docs.python.org/3", None),
    "torch": ("https://pytorch.org/docs/stable/", None),
    "numpy": ("https://numpy.org/doc/stable/", None),
}

# Suppress citation target warnings from paper references in docstrings
suppress_warnings = ["docutils", "ref.citation"]
