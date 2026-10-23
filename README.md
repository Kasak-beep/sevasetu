# SevaSetu — Civic Complaint Management System

**SevaSetu** is a civic-tech application designed to simplify communication between citizens and local authorities by providing a centralized platform for reporting and tracking public service complaints. The system focuses on improving complaint visibility, accountability, and the management of civic issues across local wards.

## 🎯 Project Overview

SevaSetu enables citizens to report civic issues such as sanitation problems, water supply disruptions, and faulty streetlights. Administrators can manage complaints, update their progress, and maintain a structured workflow from submission to resolution.

## ✨ Key Features

- **User Authentication & Role-Based Access Control (RBAC):** Separates citizen and administrator access based on user roles.
- **Civic Complaint Management:** Supports reporting issues related to sanitation, water supply, and streetlights.
- **Complaint Status Tracking:** Organizes complaints through `Submitted`, `In Progress`, and `Resolved` stages.
- **Ward Management:** Structures civic complaint handling around local administrative wards.
- **RESTful APIs:** Provides endpoints for managing users, wards, and complaints.
- **OTP Verification:** Implements OTP-based account verification with a five-minute expiry period.
- **Structured Access Control:** Restricts system operations according to user roles and permissions.

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| Java | Backend development |
| Spring Boot | REST API development |
| Spring Security / RBAC | Role-based access control, where configured |
| React | Frontend user interface |
| REST APIs | Communication between frontend and backend |
| Database | Persistent storage, according to the configured implementation |

## 🏗️ System Architecture

The application follows a client-server architecture:

1. **Frontend:** React provides the user interface for citizens and administrators.
2. **Backend:** Spring Boot processes requests, applies business logic, and manages complaint workflows.
3. **API Layer:** REST endpoints connect the frontend to backend services.
4. **Data Layer:** Stores and manages user, ward, and complaint information.

## 🔗 API Endpoints

| Endpoint | Purpose |
|---|---|
| `/users` | User-related operations |
| `/wards` | Ward management |
| `/complaints` | Civic complaint management |

*The exact HTTP methods and supported operations depend on the implemented controllers.*

## 🚀 Getting Started

### Prerequisites

- Java Development Kit (JDK)
- Maven
- Node.js and npm
- Configured database, if required by the project

### Installation

**1. Clone the repository**

```bash
git clone <YOUR_REPOSITORY_URL>
cd <YOUR_PROJECT_DIRECTORY>
```

**2. Start the Spring Boot backend**

```bash
mvn spring-boot:run
```

**3. Start the React frontend**

Open a separate terminal in the frontend directory:

```bash
npm install
npm start
```

*Adjust these commands to match your Maven configuration, frontend scripts, and project directory structure.*

## 💡 Learning Outcomes

- Designing RESTful APIs using Spring Boot.
- Implementing role-based access and account verification workflows.
- Structuring civic complaint lifecycles and status transitions.
- Integrating a React frontend with backend services.
- Organizing application functionality around users, wards, and complaints.

## 🔮 Future Enhancements

- Real-time complaint status notifications.
- Image attachments and location-based complaint reporting.
- Administrative dashboards with ward-level analytics.
- Complaint prioritization and resolution-time tracking.

---

**SevaSetu** aims to make civic issue reporting more structured, transparent, and accessible through technology.
