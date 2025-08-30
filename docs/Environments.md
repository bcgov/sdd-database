# Environments

This project is deployed to multiple OpenShift namespaces using GitHub Actions.  
Each environment is tied to a Git branch and has its own deployment URL.

---

## 🔹 Development (dev)

- **Namespace:** `a6d989-dev`
- **Branch:** `dev`
- **Deployment URL:**  
  [https://employee-information-database-a6d989-dev.apps.silver.devops.gov.bc.ca/](https://employee-information-database-a6d989-dev.apps.silver.devops.gov.bc.ca/)

- **Workflow:** `.github/workflows/dev-deploy.yml`
- **Flow:**
    1. Build runs in `a6d989-tools` namespace.
    2. Image tagged with `dev-<commitsha>-tools`.
    3. Imported into `a6d989-dev` and deployed.
    4. Automatic rollout triggered on every push to the `dev` branch.

---

## 🔹 Test (test)

- **Namespace:** `a6d989-test`
- **Branch:** `test`
- **Deployment URL:**  
  [https://employee-information-database-a6d989-test.apps.silver.devops.gov.bc.ca/](https://employee-information-database-a6d989-test.apps.silver.devops.gov.bc.ca/)

- **Workflow:** `.github/workflows/test-deploy.yml`
- **Flow:**
    1. Build runs in `a6d989-tools` namespace.
    2. Image tagged with `test-<commitsha>-tools`.
    3. Pods in `a6d989-test` pull the image directly from `a6d989-tools` (enabled via `system:image-puller` role binding).
    4. Automatic rollout triggered on every push to the `test` branch.

---

## 🔹 Notes

- **Tools namespace:** `a6d989-tools`
    - Central location for OpenShift BuildConfig and ImageStreams.
    - All environments pull their images from here.

- **Database (CrunchyDB):**
    - Dev namespace → `crunchy-postgres` (Postgres 17).
    - Test namespace → independent `crunchy-postgres` cluster, separate PVCs.
    - DB connection details stored in the secret `crunchy-postgres-pguser-app-user`.

- **Promotion flow:**
    - `dev` branch → automatically deploys to **Dev** namespace.
    - Once stable, merge `dev` → `test` branch → automatically deploys to **Test** namespace.
    - Future: `main` branch → **Prod** namespace.  