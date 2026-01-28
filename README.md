<h1 align="center">🚀 Serverless Appointment Booking System</h1>
<h3 align="center">Legacy .NET Application Modernized to AWS Serverless Architecture</h3>

<p align="center">
  <strong>.NET • AWS Lambda • API Gateway • Cognito • DynamoDB • S3</strong>
</p>

<hr/>

## 📖 Overview

<p>
This project is a <strong>cloud-native appointment booking system</strong> created by revamping a
<strong>locally hosted legacy .NET application</strong> into a
<strong>fully serverless architecture on AWS</strong>.
</p>

<p>
The modernization eliminates server management, improves scalability and availability,
reduces operational costs, and aligns the application with modern cloud best practices.
</p>

---

## 🎯 Problem Statement

<ul>
  <li>Legacy application hosted on local/on-premise servers</li>
  <li>Manual scaling during peak appointment hours</li>
  <li>High infrastructure and maintenance costs</li>
  <li>Tightly coupled to server-based architecture</li>
</ul>

<p>
These limitations made the system difficult to scale, maintain, and secure.
</p>

---

## ✅ Solution Overview

<p>
The system was <strong>re-architected into a serverless, event-driven model</strong> using AWS managed services.
AWS handles infrastructure, scaling, availability, and security, allowing the application
to focus purely on business logic.
</p>

<h4>Key Improvements</h4>
<ul>
  <li>No server provisioning or maintenance</li>
  <li>Automatic scaling based on traffic</li>
  <li>High availability by design</li>
  <li>Pay-per-use cost model</li>
  <li>Improved security with managed authentication</li>
</ul>

---

## 🏗️ Architecture Overview

<h4>Frontend</h4>
<ul>
  <li>Static web application</li>
  <li>Hosted on <strong>Amazon S3</strong></li>
</ul>

<h4>Backend</h4>
<ul>
  <li><strong>AWS Lambda (.NET)</strong> – Business logic</li>
  <li><strong>Amazon API Gateway</strong> – RESTful APIs</li>
  <li><strong>Amazon DynamoDB</strong> – Appointment & user data</li>
  <li><strong>Amazon Cognito</strong> – Authentication & authorization</li>
</ul>

---

## 🔧 Technology Stack

<h4>Backend</h4>
<ul>
  <li>.NET (C#)</li>
  <li>AWS Lambda</li>
  <li>Amazon API Gateway</li>
  <li>Amazon DynamoDB</li>
  <li>Amazon Cognito</li>
</ul>

<h4>Frontend</h4>
<ul>
  <li>Static Web Application</li>
  <li>Amazon S3</li>
</ul>

<h4>Cloud & DevOps</h4>
<ul>
  <li>AWS Serverless Architecture</li>
  <li>IAM Roles & Policies</li>
  <li>Environment-based configuration</li>
</ul>

---

## ✨ Key Features

<ul>
  <li>
    🔐 <strong>Secure Authentication</strong><br/>
    User sign-up, sign-in, and authorization using Amazon Cognito
  </li>
  <br/>
  <li>
    📅 <strong>Appointment Management</strong><br/>
    Create, view, update, and cancel appointments with low-latency DynamoDB access
  </li>
  <br/>
  <li>
    ⚡ <strong>Auto-Scaling APIs</strong><br/>
    Lambda functions scale automatically based on demand
  </li>
  <br/>
  <li>
    💰 <strong>Cost Optimized</strong><br/>
    No idle servers — pay only for actual usage
  </li>
  <br/>
  <li>
    🌍 <strong>Highly Available</strong><br/>
    Fault-tolerant design using AWS managed services
  </li>
</ul>

---

## 🔄 Legacy vs Serverless Comparison

<table>
  <thead>
    <tr>
      <th>Aspect</th>
      <th>Legacy System</th>
      <th>Serverless System</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Hosting</td>
      <td>On-Premise</td>
      <td>AWS Managed</td>
    </tr>
    <tr>
      <td>Scaling</td>
      <td>Manual</td>
      <td>Automatic</td>
    </tr>
    <tr>
      <td>Cost Model</td>
      <td>Fixed</td>
      <td>Pay-per-use</td>
    </tr>
    <tr>
      <td>Availability</td>
      <td>Limited</td>
      <td>High</td>
    </tr>
    <tr>
      <td>Security</td>
      <td>Custom</td>
      <td>AWS Managed</td>
    </tr>
  </tbody>
</table>

---

## 📂 Repository Structure

```text
/
├── frontend/            # UI source code (S3 hosted)
├── backend/             # .NET Lambda functions
│   ├── AppointmentAPI
│   ├── Auth
│   └── Shared
├── infrastructure/      # AWS configuration / IaC
├── docs/                # Architecture & design documents
└── README.md
