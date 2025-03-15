# Nexus Health-Tracking Application

Nexus is a mobile health-tracking application designed to assist individuals in managing their daily health routines by tracking vital health information and providing advice through a user-friendly smartphone app. Built with React Native, it supports both Android and iOS platforms with a single codebase.
_______________________________________________________________________________________________________________________________________
**Key Features**

  - *User Authentication*

      - Secure login credentials for user authentication.
      - Management of user accounts and permissions.

  - *Health Data Management*

      - Log daily health metrics such as weight and blood pressure.
      - Store metrics in a secure database, accessible by users or authorized personnel.
      - AI-assisted notes or recommendations for users.

  - *Data Security*

      - Passwords stored in a hashed or encrypted form.
      - Use of secure protocols (HTTPS) for data protection during transit.
      - Regular backups to prevent data loss.
_______________________________________________________________________________________________________________________________________
**System Architecture**

  - *Frontend*

      - Developed using React Native to ensure a consistent user experience across platforms.
      - Designed to minimize steps required to manage data and view health information.

  - *Backend*

      - Built with Python (FastAPI) for managing user authentication and data storage.
      - Utilizes an SQL database for structured data like medical records.
_______________________________________________________________________________________________________________________________________
**Development Guidelines**

  - *Code Management*

      - All source code maintained in a Git repository for collaboration and easy updates.
      - Code documentation to facilitate troubleshooting and future enhancements.
      - Architecture supports scalability for new features and increased user load.

  - *Testing and Quality Assurance*

      - Comprehensive testing of new features and bug fixes.
      - Use of automated testing tools to ensure code quality.
_______________________________________________________________________________________________________________________________________
**Contribution Process**

  1. Fork the Repository

      - Create a personal copy of the repository on GitHub.

  2. Create a Branch

      - Develop features or bug fixes in a new branch.

  3. Make Changes

      - Ensure changes are well-documented and tested.
        
  4. Submit a Pull Request

      - Submit changes for review and integration into the main repository.
_______________________________________________________________________________________________________________________________________
**Prerequisites**

Before you begin, ensure you have met the following requirements:

  1. Make sure you have Git installed.
  2. Make sure you have Visual Studio Code (VS Code) installed.
  3. Make sure you have Node.js and npm installed.
  4. Make sure you have the Expo CLI installed globally.
  5. Make sure you have Python installed. (and on PATH)
_______________________________________________________________________________________________________________________________________
**Installation and Setup**

*Cloning the Repository*
  - Clone the repository to your local machine.


*Project Structure*
  - The repository contains two main folders:
      - backend: Contains the FastAPI backend.
      - frontend: Contains the React Native/Expo frontend.


*Backend Setup*
  1. Navigate to the backend directory:

      ```bash
      cd backend
      ```

  3. Create a virtual environment:
 
      ```bash
      python -m venv venv
      ```
  
  3. Activate the virtual environment:

      On macOS/Linux:
        
          
       source venv/bin/activate
          
          
      On Windows:
        
          
       .\venv\Scripts\activate
          

  4. Install the required packages:

      ```bash
      pip install -r requirements.txt
      ```

  5. Start the FastAPI backend:
  
      ```bash
      python -m uvicorn backend.main:app --reload
      ```

  6. The FastAPI server should be running locally, and endpoints such as /auth/login and /auth/register will be accessible.


*Frontend Setup*

  1. Open another terminal or command line window.

  2. Navigate to the frontend directory:
   
      ```bash
      cd frontend
      ```
  3. Install the necessary packages:
  
      ```bash
      yarn install
      ```
  4. Start the Expo development server:
  
      ```bash
      npx expo start -c
      ```
  5. To view the app:

      - Press w to run on a web browser.
      - Press i if you have an iOS simulator installed (requires Xcode).
      - Alternatively, scan the QR code using the Expo Go app from the App Store.
_______________________________________________________________________________________________________________________________________
**Development Notes**

  - The current setup allows for login and registration functionality, though they may not be fully operational.
  - Use tools like Postman or curl for testing endpoints.
  - The Expo Go app facilitates live reloading for development on mobile devices.
