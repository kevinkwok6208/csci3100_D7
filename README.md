# csci3100_D7 E-mart

## 1. Setup Requirements

### 1.1 Browser Recommended
- Chrome
- Edge
- Firefox

### 1.2 MacOS Installation
1. Open Terminal and install Homebrew
2. Run the following command:
   ```bash
   brew install nvm && nvm install 23.9.0 && nvm use 23.9.0
   ```
3. Verify installation by running:
   ```bash
   node --version
   ```

### 1.3 Windows Installation
1. Go to: https://nodejs.org/en/download
2. Download & install latest Node.js
3. Verify installation by opening Window Command Prompt and running:
   ```bash
   node --version
   ```

## 2. Project Setup

### 2.1 Clone the repository from GitHub
1. Open a terminal/Command prompt, type the following to clone repository into your own folder:
   ```bash
   cd {your own folder path}
   ```
   ```bash
   git clone https://github.com/kevinkwok6208/csci3100_D7.git
   ```
### 2.1.1 Branch Description
We are using feature base strategy, we have created a branch for each feature and then merged the branch to the main branch.

According to the lecture notes, once we merge the branch to the main branch, we need to delete the branch.

So, we cannot provide the decription of all branch in README.md.

### 2.2 Set Up the Backend
1. Navigate to the backend directory:
   ```bash
   cd csci3100_D7/backend
   ```
2. Install the necessary packages:
   ```bash
   npm install
   ```
3. Once the installation is complete, start the backend server:
   ```bash
   npm start
   ```
   If successful, "> backend@1.0.0 start" will be shown in the terminal.

### 2.3 Set Up the Frontend
1. Open a new terminal window while keeping the backend server running.
2. Navigate to the project directory:
   ```bash
   cd {your own folder path}
   ```
3. Navigate to the frontend directory:
   ```bash
   cd csci3100_D7/frontend
   ```
4. Install the necessary packages:
   ```bash
   npm install
   ```
5. Once the installation is complete, start the frontend development server:
   ```bash
   npm start
   ```
   If successful, "Compiled successfully! You can now view frontend in the browser." will be shown in the terminal.

The application should now automatically open in your default web browser. If it doesn't, you can access it by navigating to https://localhost:3000 in your browser. If you encounter security warnings, click on "Advanced" options and then "Proceed to site" to safely continue to the website.

## 3. Configuration Files Setup

Open a new terminal window while keeping the backend and frontend development server running.

1. Navigate to the project directory:
   ```bash
   cd {your own folder path}
   ```
2. Navigate to the configuration directory:
   ```bash
   cd csci3100_D7/backend/config
   ```

### 3.1 OTP_HOST Environment Variables

Get a Google App Password:
1. Go to your Google Account (https://myaccount.google.com/)
2. Make sure 2-Factor Authentication is enabled
3. Search for "App passwords" in the search bar
4. Select "App passwords" under "Security"
5. Click "Create a new app password"
6. Select "Other (Custom name)" from the dropdown
7. Enter a name (e.g., "CSCI3100D7")
8. Click "Generate"
9. Copy the 16-character code that appears (no spaces needed)

Create the OTP_HOST.env file and input the following commands:
*(Replace "your_gmail@gmail.com" with your Gmail address and "your_app_password" with your Google App password.)*

```bash
echo EMAIL_USER={your_gmail@gmail.com} > OTP_HOST.env
```
```bash
echo EMAIL_APP_PASSWORD={your_app_password} >> OTP_HOST.env
```

For Example:
```bash
echo EMAIL_USER=csci2720host@gmail.com > OTP_HOST.env
```
```bash
echo EMAIL_APP_PASSWORD=fqzitdqkfjiuvhbn >> OTP_HOST.env
```

### 3.2 PayPal Environment Variables

Get PayPal credentials:
1. Go to PayPal Developer website (https://developer.paypal.com/tools/sandbox/accounts/)
2. Sign up or log in to your account
3. Click on "Apps & Credentials" in the dashboard
4. Click "Create App" button
5. Give your app a name and click "Create App"
6. On the next page, you'll see your Client ID and Secret
7. Copy these values to use in the coming commands below

Create the paypal.env File and input the following commands:
*(Replace "your_Client ID" with your Client ID and "your_Secret" with your Secret)*

```bash
echo PAYPAL_CLIENT_ID={your_Client ID} > paypal.env
```
```bash
echo PAYPAL_CLIENT_SECRET={your_Secret} >> paypal.env
```
```bash
echo PAYPAL_SANDBOX_API_URL=https://api-m.sandbox.paypal.com >> paypal.env
```
```bash
echo PAYPAL_RETURN_URL=/checkout-status >> paypal.env
```
```bash
echo PAYPAL_CANCEL_URL=/cart >> paypal.env
```

For Example:
```bash
echo PAYPAL_CLIENT_ID=AcvicIpiObpRZAfvOeJ2R3JUUf7NJXh19nsOPIDlVYJSSQxMxzWRkHnT_tbVg5WrCbkKHBQHUU0fbMF2 > paypal.env
```
```bash
echo PAYPAL_CLIENT_SECRET=EFQ_5UFd8EXROEhX4W6GPVlxZlfD0y5u533tjmEWRHn0zOqTEfC9EmI8uU6XPK6dO6jXTnsCPjwfX1IV >> paypal.env
```
```bash
echo PAYPAL_SANDBOX_API_URL=https://api-m.sandbox.paypal.com >> paypal.env
```
```bash
echo PAYPAL_RETURN_URL=/checkout-status >> paypal.env
```
```bash
echo PAYPAL_CANCEL_URL=/cart >> paypal.env
```

### 3.3 Cloudinary Environment Variables

Get Cloudinary credentials:
1. Go to Cloudinary website (https://cloudinary.com/)
2. Sign up or log in to your account
3. Go to your Dashboard by clicking "Dashboard"
4. Under "Account Details" section, you'll find:
   - Cloud Name
   - API Key
   - API Secret
5. Copy these values to use in the commands below

Create the cloudinary.env file and input the following commands:
*(Replace "your_Cloud Name" with your Cloud Name, "your_API Key" with your API Key and "your_API Secret" with your API Secret.)*

```bash
echo CLOUDINARY_CLOUD_NAME={your_Cloud Name} > cloudinary.env
```
```bash
echo CLOUDINARY_API_KEY={your_API Key} >> cloudinary.env
```
```bash
echo CLOUDINARY_API_SECRET={your_API Secret} >> cloudinary.env
```
```bash
echo CLOUDINARY_URL=cloudinary://{your_API Key}:{your_API Secret}@{your_Cloud Name} >> cloudinary.env
```

Example:
```bash
echo CLOUDINARY_CLOUD_NAME=doigqstxw > cloudinary.env
```
```bash
echo CLOUDINARY_API_KEY=686448784234212 >> cloudinary.env
```
```bash
echo CLOUDINARY_API_SECRET=ozgUwZSFLP2mtFlgXxbyC4Br3n4 >> cloudinary.env
```
```bash
echo CLOUDINARY_URL=cloudinary://686448784234212:ozgUwZSFLP2mtFlgXxbyC4Br3n4@doigqstxw >> cloudinary.env
```

### 3.4 Environment Set Up Finish

Now, you are able to use the Web app after login with default username and password as an admin:
- Default admin username: admin
- Default admin password: admin123
- Default user username: testuser
- Default user password: user123

- Paypal Card for testing:4783975240686210
- Exp:04/2030
- CVS:000

- Paypal AC:sb-r8ujj38963444@personal.example.com
- Paypal Pw:mZ4he6^% 
Let's enjoy Shopping!
