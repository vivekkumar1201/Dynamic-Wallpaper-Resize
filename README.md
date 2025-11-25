<img width="1506" height="776" alt="image" src="https://github.com/user-attachments/assets/243d6e4b-80dc-4f44-a8be-aa035a56db11" />

<img width="3012" height="1552" alt="image" src="https://github.com/user-attachments/assets/6f746790-6bdc-42b3-ab36-b826f4100ebc" />

# Dynamic Wallpaper Resize 🍌

**Dynamic Wallpaper Resize** is a AI-powered image editor designed to transform your photos into perfect wallpapers for any device.

Powered by Google's **Gemini 2.5 Flash Image** model, this application allows users to intelligently resize, expand (outpaint), and stylize images using simple natural language prompts. Whether you need to adapt a landscape photo for your phone's lock screen or give your favorite shot a completely new artistic style, Nano Banana makes it effortless.

## ✨ Key Features

- **Intelligent Aspect Ratio Transformation**: Seamlessly convert images between formats (e.g., 4:3 to 16:9, 1:1 to 9:16). The AI intelligently fills in missing visual data to fit the new dimensions naturally without distortion.
- **Natural Language Editing**: Simply describe what you want to change.
  - *"Add a retro filter"*
  - *"Remove the person in the background"*
  - *"Make it look like a cyberpunk city"*
- **Device-Ready Presets**: One-click aspect ratio selection for common formats:
  - **Mobile (9:16)**
  - **Desktop/TV (16:9)**
  - **Tablet (3:4)**
  - **Square/Social (1:1)**
- **High-Performance**: Built on the Gemini 2.5 Flash Image model for rapid generation and high-quality results.

## 🚀 Tech Stack

- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **AI Integration**: Google GenAI SDK (`@google/genai`)

## 🛠️ Getting Started

### Prerequisites

- Node.js (v18 or higher)
- A Google Cloud Project with the Gemini API enabled
- An API Key from Google AI Studio

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/nano-banana-wallpaper.git
   cd nano-banana-wallpaper
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment**
   Create a `.env` file in the root directory and add your API Key:
   ```env
   API_KEY=your_api_key_here
   ```

4. **Run the Application**
   ```bash
   npm run dev
   ```

## 🎮 Usage Guide

1. **Upload Source**: Drag and drop an image or click to select a file from your device.
2. **Select Target Ratio**: Choose the aspect ratio that matches your destination screen (e.g., Select `9:16` for a smartphone wallpaper).
3. **Enter a Prompt (Optional)**:
   - Leave it blank to simply extend and resize the image.
   - Type a command like *"Add a sunset background"* to creatively edit the image while resizing.
4. **Generate**: Click **Generate Wallpaper** and wait for the AI to process your request.
5. **Download**: Once satisfied, click the download button to save your new wallpaper.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
