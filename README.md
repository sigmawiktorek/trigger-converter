# 🔄 Trigger Converter

> **Convert triggers between Event Exucutor and LUA Executor formats seamlessly**

A modern, lightweight web application that allows you to convert FiveM trigger formats.

## ✨ Features

- **🔀 Bidirectional Conversion**: Convert from Keyser/Susano to Executor format and vice versa
- **🌐 Multi-language Support**: Available in Polish (PL) and English (EN)
- **🌙 Dark/Light Theme**: Toggle between dark and light modes for comfortable usage
- **📱 Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **⚡ Real-time Processing**: Instant conversion with visual feedback
- **📋 One-click Copy**: Copy results to clipboard with a single click
- **🧹 Easy Clear**: Clear all inputs and outputs quickly
- **🔧 Format Support**: Handles multiple formats including nested arrays, callback functions, and comments

## 🚀 Live Demo

**[Try it now!](https://sigmawiktorek.github.io/trigger-converter)**

## 📖 Usage

### Input Formats Supported:

**Event Executor Format:**
```lua
esx:test | [123, {'time': 60, 'reason': 'test'}]
```

**Lua Executor Format:**
```python
TriggerServerEvent("esx:test", 123, {time=60, reason="test"})
```

### How to Use:

1. **Paste your trigger code** into the input area
2. **Click "Process"** to convert between formats
3. **Copy the result** using the copy button
4. **Switch languages** using PL/EN toggle
5. **Change theme** with the sun/moon icon


## 🎯 Supported Formats

The converter intelligently handles:

- **Multi-line trigger blocks**
- **Nested arrays and objects**
- **Callback functions**
- **Comments in code**
- **Mixed data types** (strings, numbers, booleans, tables)
- **Special characters and escape sequences**

## 🔧 Installation & Development

### Quick Start:
```bash
# Clone the repository
git clone https://github.com/sigmawiktorek/trigger-converter.git

# Open in your browser
open index.html
```

### File Structure:
```
trigger-converter/
├── index.html          # Main HTML file
├── style.css           # Styles and themes
├── script.js           # JavaScript logic
├── translations.json   # Language translations
├── LICENSE             # Mit License file
└── README.md           # This file
```

## 📞 Support

Having issues or questions?

- 🐛 **Bug Reports**: [Open an issue](https://github.com/sigmawiktorek/trigger-converter/issues)
- 💡 **Feature Requests**: [Create a feature request](https://github.com/sigmawiktorek/trigger-converter/issues)

---

⭐ **If this tool helped you, consider giving it a star!** ⭐

**Made with ❤️ for the FiveM community**
