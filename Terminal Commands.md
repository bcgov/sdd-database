## Docker

1. Build image locally with

```docker
docker build -t <docker_image_name> .
```

2. Create, run and exec into the docker container

```docker
docker run -it --entrypoint /bin/sh --name <docker_container_name> <docker_image_name as used in the above command>
```

## OpenShift

### Port Forwarding to connect to Crunchy DB on OpenShift

```shell
oc port-forward pod/crunchy-postgres-pgbouncer-dfb6d8c4c-2pnxj 5432:5432 -n a6d989-dev
```

### Re-deployment to OpenShift

1. Commit and push code to GitHub


2. Trigger a new build in OpenShift by running:

```shell
   oc start-build employee-information-database -n a6d989-tools
```

3. Monitor the build logs

```shell
oc logs -f bc/employee-information-database -n a6d989-tools
```

4. Add our custom tag to the newly created image in tools

```shell
oc tag a6d989-tools/employee-information-database:latest a6d989-tools/employee-information-database:v0.0.5-tools -n a6d989-tools
```

5. Import this image in the dev namespace and update the tag

```shell
oc tag a6d989-tools/employee-information-database:v0.0.5-tools a6d989-dev/employee-information-database:v0.0.5-dev -n a6d989-dev
```

6. _Need to check if I need this step_

Update the deployment to use this new versioned image

```shell
oc set image deployment/employee-information-database employee-information-database=image-registry.
openshift-image-registry.svc:5000/a6d989-dev/employee-information-database:v0.0.5-dev -n a6d989-dev
```

7. Trigger a new deployment

```shell
oc rollout restart deployment/employee-information-database -n a6d989-dev
```

8. Monitor the deployment logs

```shell
 oc logs -f deployment/employee-information-database -n a6d989-dev
```

9. Verify the deployment update

```shell
oc rollout status deployment/employee-information-database -n a6d989-dev
```

### Updating spec for OpenShift Resources

```shell
oc apply -f <filepath of the updated yaml file>
```

## Prisma

Everytime, the `schema.prisma` file is modified, run the below command to

1. create a new migration file
2. execute the migration against the database
3. installs the prisma client package (if it does not exists)
4. generates the prisma client with which we can interact with the database

```shell
npx prisma migrate dev --name <nameOfMigration>
```