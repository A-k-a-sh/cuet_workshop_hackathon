Mysoft Heaven
(A complete IT solution)
GROUP PROJECT COMPITITION
COLLABORATE, BUILD, AND SHOWCASE YOUR TECHNICAL SKILLS
Saturday, 25th July 2026
Duration: 1 hr 30 min
PROJECT 1 | AI Self-Introduction Analyzer
Speech-to-Text | LLM / NLP | React / HTML+JS | Browser API
OBJECTIVE
Build a web application where a user records a 30-second spoken self-introduction directly in the browser or uploads an audio file and receives an objective, structured breakdown of their communication quality. The tool evaluates speaking pace, filler word usage, grammar, vocabulary, and language confidence without requiring a human reviewer.
PROJECT TASKS
 * Voice capture: Implement a Record button and an Upload option (supporting .mp3, .m4a, .amr). Request microphone access and capture a 30-second spoken self-introduction.
 * Speech-to-text: Transcribe the recorded or uploaded audio using the Web Speech API (Chrome / Edge) immediately after capture ends.
 * Delivery metrics: Calculate speaking pace (words per minute) and filler word count ("um", "uh", "like", etc.) directly from the transcript and recording duration.
 * Content analysis: Send the transcript to an LLM to assess grammar accuracy, vocabulary range, structural clarity, and language confidence (including hedging language and word choice).
 * Scorecard: Combine all delivery metrics and content analysis results into a single, clearly presented results view with category scores and specific, actionable feedback for the user.
SUGGESTED TOOLS
 * Speech-to-Text: Web Speech API — built into Google Chrome and Microsoft Edge, no setup required.
 * LLM / Content Analysis: Groq API — free tier available with a free account registration.
 * Frontend: React or plain HTML/JS with Tailwind CSS. No backend required for a single-flow demo.
 * Hosting: Localhost is sufficient for demonstration purposes.
DELIVERABLE
✓ A fully working web application where a visitor records or uploads a 30-second self-introduction and receives a complete communication scorecard in response.

PROJECT 2 | Heart Disease Risk Predictor
Train a logistic regression model and deploy it as a browser-based, backend-free prediction tool.
Machine Learning | Logistic Regression | HTML + JS | No Backend
OBJECTIVE
Train a logistic regression classification model on the Heart Disease dataset, extract its learned weights, and embed them directly into a client-side web application. The tool allows users to enter their own health values and instantly receive a personalized heart disease risk estimate — entirely within the browser, with no backend or external inference API required at runtime.
PROJECT TASKS
 * Data Preparation: Load the Heart Disease dataset (Kaggle, 1,025 rows, 14 columns). Select four features — age, cholesterol, resting blood pressure, and maximum heart rate. Normalized values to a 0–1 range and split into 80% training and 20% test sets.
 * Model Training: Train a logistic regression model using TensorFlow.js or scikit-learn (Python / Google Colab). Run for a sufficient number of epochs and confirm reasonable accuracy on the test split. Fine-tune the model using your own domain knowledge to achieve the best possible result.
 * Weight Extraction: Extract the trained model's final weights and bias values. Hardcode them directly into the web application's client-side JavaScript as plain numbers — no ML library is required at runtime.
 * Input Interface: Build a clean user interface where participants can enter their own values for the four features used during training.
 * Results Display: Show the computed risk percentage, highlight which entered value contributed most to the score, and include a clear informational disclaimer stating this tool is not a medical diagnosis.
SUGGESTED TOOLS
 * Dataset: Heart Disease Dataset — Kaggle (https://www.kaggle.com/datasets/johnsmith88/heart-disease-dataset). Download as CSV; no upload step needed.
 * Model Training: Google Colab with scikit-learn, or TensorFlow.js in the browser console.
 * Web Application: Plain HTML + JavaScript + Tailwind CSS. No ML library required at runtime.
DELIVERABLE
✓ A working web application where a user enters age, cholesterol, resting blood pressure, and maximum heart rate and receives an instant heart disease risk percentage with a contributing factor breakdown.

PROJECT 3 | Multi-Role Marketplace Prototype
A scoped e-commerce demo with distinct Shopper, Vendor, and Admin experiences sharing a single data layer.
Role-Based Auth | React / HTML+JS | LocalStorage | UI/UX Design
OBJECTIVE
Build a functional prototype of a multi-role marketplace where three distinct user roles exist: a Shopper who browses and purchases, a Vendor who manages product listings, and an Admin who oversees the entire platform. Demonstrate the complete role-based flow using local or mock data rather than a production database.
PROJECT TASKS
 * Role-based login: Build a single login screen where selecting a role (Shopper / Vendor / Admin) — via a dropdown or pre-seeded demo accounts — routes the user to the appropriate dashboard. Full password security is not required for a prototype.
 * Shopper view: Browse a seeded product list, view individual product details, add items to a cart, and place a mock order.
 * Vendor view: A dashboard to add, edit, and remove the vendor's own product listings, and view a list of orders placed for their items.
 * Admin view: A dashboard displaying all registered users, all vendors, and all orders across the platform — with the ability to remove a vendor's listing or suspend an account.
 * Shared data layer: All three roles read from and write to the same in-memory or localStorage data store, so any action in one role is immediately reflected across the others (e.g. a vendor's newly added product appears instantly in the Shopper's store).
SUGGESTED TOOLS
 * Frontend: React with Tailwind CSS, or plain HTML/JS for a faster build.
 * Data Layer: In-memory JavaScript state or browser localStorage — no real database required.
DELIVERABLE
✓ A working multi-role prototype where switching between Shopper, Vendor, and Admin roles demonstrates the full role-based flow with shared, live data.

PROJECT 4 | Automated Notification Workflow
Design and deploy a fully automated email or Telegram notification workflow using n8n — no code required.
Workflow Automation | n8n | Email / Telegram | No-Code
OBJECTIVE
Design, build, and activate an automated notification workflow using n8n's visual canvas. The workflow triggers based on a defined condition and dispatches a structured email or Telegram message automatically. The entire project is built inside n8n using nodes — no backend, no custom code, and no external web application is required.
PROJECT TASKS
 * Account setup: Create a free n8n account at n8n.io. New accounts receive a 15-day full-feature trial — no credit card required.
 * Create a new workflow: Open the n8n canvas and begin with a blank workflow.
 * Set a trigger: Add a trigger node to initiate the workflow. Use one of the following — Manual Trigger (run on button click), Schedule Trigger (run automatically at a set time, e.g. every morning at 9:00 AM), or Webhook Trigger (run when a form or external request hits a specified URL).
 * Add a data node: Use the Set node to define the content that will populate the notification — for example, recipient name, contact details, and a custom message body.
 * Add a condition (recommended): Use the IF node to introduce simple logic. For example: if the recipient's status is "active", send the notification — otherwise, skip.
 * Connect the notification node: Add a Gmail node, Send Email (SMTP) node, or Telegram node after the condition. Configure the recipient, subject line, and message body using dynamic values from the Set node.
 * Test the workflow: Use the built-in Execute Workflow function to test each node step by step and confirm the notification is delivered correctly.
 * Activate the workflow: Toggle the workflow to Active so it runs automatically based on the configured trigger.
SUGGESTED TOOLS
 * Platform: n8n.io — free 15-day trial, no credit card required.
 * Nodes to use: Manual / Schedule / Webhook Trigger · Set Node · IF Node · Gmail Node, Send Email (SMTP) Node, or Telegram Node.
DELIVERABLE
✓ A working, activated n8n workflow that automatically dispatches a structured notification based on a trigger and condition — demonstrated live by executing the workflow and showing the received email or Telegram message.