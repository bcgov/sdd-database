import {EntityActionResult} from "@/types";

type EntityFormAction = (
    prevState: EntityActionResult,
    formData: FormData
) => Promise<EntityActionResult>

interface EntityActionConfig<T> {
    parse: (formData: FormData) => T
    validate: (entity: T) => Promise<string | undefined> | string | undefined
    persist: (entity: T) => Promise<unknown>
    getReadablePrismaError: (error: unknown, entity: T) => string
}

export function createEntityAction<T>(config: EntityActionConfig<T>): EntityFormAction {
    const {parse, validate, persist, getReadablePrismaError} = config

    return async function persistEntity(
        _prevState: EntityActionResult,
        formData: FormData
    ): Promise<EntityActionResult> {
        const entity: T = parse(formData);

        const validationError = await validate(entity);
        if (validationError) {
            return {
                status: "error",
                error: validationError
            };
        }

        try {
            await persist(entity)

            return {status: "ok"};
        } catch (error) {
            return {
                status: "error",
                error: getReadablePrismaError(error, entity)
            }
        }
    }
}

interface EntityCreateAndUpdateActionsConfig<T>
    extends Omit<EntityActionConfig<T>, "persist"> {
    persist: {
        create:  (entity: T) => Promise<unknown>;
        update:  (entity: T) => Promise<unknown>;
    }
}

export function createEntityActions<T>(config: EntityCreateAndUpdateActionsConfig<T>) {
    const {parse, validate, persist, getReadablePrismaError} = config;

    return {
        addAction: createEntityAction({
            parse,
            validate,
            persist: persist.create,
            getReadablePrismaError,
        }),
        updateAction: createEntityAction({
            parse,
            validate,
            persist: persist.update,
            getReadablePrismaError,
        }),
    }
}
