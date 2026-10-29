
![Gemini-Generated-Gif-64jnac64jnac64jn.gif](https://i.postimg.cc/9Mq46V36/Gemini-Generated-Gif-64jnac64jnac64jn.gif)
# Project Name: MessWise2.0

## Target Refectory
#### E2, The Kamar-Taj Refectory
# 
## Team Details: Team Terror Code 404 (ID: 254) 
- Vansshiekaa Singh (Reg: 20259028, Materials Engineering
- Ankur (Reg: 20259001, Materials Engineering)
- Saksham Kumar Singh (Reg: 20259023, Materials Engineering)
# 
# Description
MessWise is a centralized, role-based web application designed to digitize and streamline hostel mess operations. Developed for The Kamar-Taj Refectory (E2) by Team Terror Code 404 (Webster 2026), MessWise replaces manual head-counts, verbal tracking, and paper processes with a data-driven system built for accountability, precision, and efficiency.

# 
## Problem Statement
- Inaccurate demand estimates causing food wastage or shortages.  
- Absence of a cutoff mechanism for students to opt in, opt out, or cancel meals.
- Duplicate meal usage ("double-dipping") due to manual verification.   
- Lack of standardized per-item cooking and serving quantity planning.
- Absence of systematic quality records for raw materials and cooked food.
- Lack of task ownership and staff accountability when operational issues occur.
- Inaccurate booking and consumption records leading to uncalculated rebates. 
# 
## Proposed Solution
- Centralized web application bridging students, mess staff, and admins.
- Server-enforced cutoff times to lock meal headcounts and compute per-item serving plans.
- Pre-service quality checks on raw materials and prepared food.   Dynamic, time-limited, cryptographically signed QR codes for single-use check-in validation.
- Central audit ledger for bookings, quality checks, duty tasks, and waste analytics.

![Whats-App-Image1-2026-10-29-at-5-52-52-AM.jpg](https://i.postimg.cc/BnfFsrYK/Whats-App-Image1-2026-10-29-at-5-52-52-AM.jpg)

# 

![Whats-App-Image2-2026-10-29-at-5-52-52-AM.jpg](https://i.postimg.cc/rpFN26s9/Whats-App-Image2-2026-10-29-at-5-52-52-AM.jpg)

# 

![Whats-App-Image3-2026-10-29-at-5-52-52-AM.jpg](https://i.postimg.cc/t4dBHt5y/Whats-App-Image3-2026-10-29-at-5-52-52-AM.jpg)

# 

![Whats-App-Image4-2026-10-29-at-5-52-52-AM.jpg](https://i.postimg.cc/26yGhpfj/Whats-App-Image4-2026-10-29-at-5-52-52-AM.jpg)

# 

![Whats-App-Image5-2026-10-29-at-5-52-52-AM.jpg](https://i.postimg.cc/NLqk352X/Whats-App-Image5-2026-10-29-at-5-52-52-AM.jpg)

# 

## Process Flow of the Website
- Login & Role Access: Student, staff member, or admin login via role-based access control.
- Menu & Assignment Publishing: Admin publishes menus, per-head serving standards, and duty assignments for staff (procurement, cooking, serving, hygiene).
- Student Meal Booking: Students log meal opt-ins/opt-outs and dietary preferences before the cutoff time.   State Cutoff Lock: Backend locks meals (OPEN → LOCKED), preventing booking modifications.
- Serving Plan Generation: System computes the serving plan using confirmed headcount $\times$ per-head quantities plus a historical no-show buffer, sending targets to the kitchen.
- Staff Quality Inspection: Assigned staff complete digital checklists (freshness, expiry, temperature, hygiene, taste) with PASS/FAIL flags, remarks, and optional photos; failures trigger admin alerts.
- QR Token Generation: Student app generates a rotating (~30s window) HMAC-SHA256 signed QR code.
- Scanning & Verification: Staff scan the QR code; backend verifies the signature, window, and booking status, then atomically updates the booking to CONSUMED and writes the attendance record.
- Post-Service Logging: Staff record actual quantity served and leftover quantities.
- Admin Auditing: Dashboard displays demand, attendance, no-shows, quality results, staff duty logs, planned vs. served quantities, rebates, and waste analytics
# 
## Core Features

- Role-Based Portals & Authentication: Dedicated interfaces for Students, Staff, and Administrators secured using JWT stored in httpOnly cookies
- Meal Opt-In / Opt-Out Scheduling: Allows students to book or skip upcoming meals and record specific dietary preferences before deadlines.
- Atomic Cutoff Engine: State-machine-driven meal management (OPEN → LOCKED → SERVED → CLOSED) using real-time countdowns and strict server/database timestamp validation.
- Audit & Consumption Ledger: Maintains non-repudiable logs of all meal bookings, real-time check-ins, and student no-shows.
- Kitchen Serving Quantity Planner: Automatically converts locked student headcounts into exact per-item cooking plans using configurable per-head standards and data-backed buffers. Includes post-service logging for actual quantities served.
- Product & Food Quality Checklists: Digital quality control workflow for raw materials and cooked dishes (evaluating freshness, expiry, temperature, hygiene, and taste). Supports PASS/FAIL flags, staff remarks, optional photos, and instant admin alerts on failures.
- Staff Duty & Accountability Tracking: Assigns specific operational tasks (procurement, cooking, serving, hygiene) to named staff members with set deadlines, tracking per-staff performance and overdue task flags.
- Admin Dashboard: Comprehensive reporting interface displaying real-time attendance, meal counts, quality check audit trails, planned vs. served quantities, and staff performance records.
#  
## Advanced Features (Planned & Demonstrable)
- Food-waste analytics tracking projected vs. consumed meals and leftover trends.
- Automated rebate billing calculating monthly credits for opted-out meals.
- Student feedback module linking food quality ratings to quality checks.
- Offline scan queue (Stretch Goal) using Service Worker caching with HMAC validation and post-sync reconciliation.
# 
## Tech Stack & External Libraries
- #### Next.js (React, TypeScript):
  Frontend and API routes for combined UI and backend development.
- #### PostgreSQL:
  Primary database handling ACID transactions, row-level locking, and relational constraints.
- #### node-postgres (pg):
  Database driver with connection pooling for direct SQL and transaction control.
- #### Node.js crypto (built-in): 
  Built-in HMAC-SHA256 signature generation for QR validation.
- #### jose:
  Standard-compliant library for JWT session handling.
- #### qrcode: 
  Client-side and server-side QR generation.   
- #### html5-qrcode: 
  Camera-based QR scanning in mobile browsers for staff.
- #### Zod: 
  Schema validation for input endpoints, checklists, and serving quantities.
- #### Recharts: 
  Analytics charts for dashboard visualization
  # 
# Role-Based Access Control (RBAC) Matrix
| Portal / Role | Access & Key Operations |
| :--- | :--- |
| **Student** | View weekly menu, manage meal opt-in/opt-out before cutoff, generate cryptographic QR token for check-in, track rebate billing balance. |
| **Mess Worker / Staff** | High-speed QR scanner portal for dining hall validation, offline scan queuing, real-time meal check-in verification. |
| **Hostel Admin / Chief Warden** | Menu scheduling, food waste analytics dashboard, manual attendance overrides, monthly rebate ledger approvals. |
| **System Admin** | Multi-hostel tenant management, user onboarding/role assignments, audit logging, system parameter configuration. |

---


### 📊 Overall Project Progress

```text
Phase 1: Core System & Multi-Tenant Engine   [████████████████████] 100%
Phase 2: Mobile, Offline & Automation        [████████░░░░░░░░░░░░]  40%
Phase 3: Hardware Integration & AI Analytics [██░░░░░░░░░░░░░░░░░░]  10%