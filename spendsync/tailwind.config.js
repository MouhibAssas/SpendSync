export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          // Primary - Dark Blue (Trust, Finance, Professional)
          primary: {
            50: '#f0f4ff',
            100: '#dbe4ff',
            200: '#bac8ff',
            300: '#91a7ff',
            400: '#748ffc',
            500: '#5c7cfa',    // Main blue
            600: '#4c6ef5',
            700: '#4263eb',
            800: '#3b5bdb',
            900: '#364fc7',
          },
          
          // Accent - Orange/Yellow (Energy, Social, Action)
          accent: {
            50: '#fff9db',
            100: '#fff3bf',
            200: '#ffec99',
            300: '#ffe066',
            400: '#ffd43b',
            500: '#fcc419',    // Golden yellow
            600: '#fab005',
            700: '#f59f00',
            800: '#f08c00',
            900: '#e67700',
          },
          
          // Neutral - Sophisticated Gray
          neutral: {
            50: '#f8f9fa',
            100: '#f1f3f5',
            200: '#e9ecef',
            300: '#dee2e6',
            400: '#ced4da',
            500: '#adb5bd',
            600: '#868e96',
            700: '#495057',
            800: '#343a40',
            900: '#212529',
          },
          
          // Success - Green (Positive actions)
          success: {
            50: '#ebfbee',
            100: '#d3f9d8',
            200: '#b2f2bb',
            300: '#8ce99a',
            400: '#69db7c',
            500: '#51cf66',
            600: '#40c057',
            700: '#37b24d',
            800: '#2f9e44',
            900: '#2b8a3e',
          }
        }
      },
    },
    plugins: [],
  }