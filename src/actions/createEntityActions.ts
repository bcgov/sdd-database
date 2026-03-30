import {EntityActionResult} from "@/types";

interface EntityActionConfig<T> {
    parse: (formData: FormData) => T;
    validate?: (entity: T) => string | undefined;
    persist: {
        create:  (entity: T) => Promise<unknown>;
        update:  (entity: T) => Promise<unknown>;
    }
    getReadablePrismaError: (error: unknown, entity: T) => string;
}

export function createEntityActions<T>(config: EntityActionConfig<T>) {
    const {parse, validate, persist, getReadablePrismaError} = config;

    async function persistEntity(
        mode: "create" | "update",
        _prevState: EntityActionResult,
        formData: FormData
    ): Promise<EntityActionResult> {
        const entity: T = parse(formData);

        const validationError = validate?.(entity);
        if (validationError) {
            return {
                status: "error",
                error: validationError
            };
        }

        try {
            if (mode === "create") {
                await persist.create(entity);
            } else {
                await persist.update(entity);
            }
            return {status: "ok"};
        } catch (error) {
            return {
                status: "error",
                error: getReadablePrismaError(error, entity)
            }
        }
    }

    return {
        addAction: persistEntity.bind(null, "create"),
        updateAction: persistEntity.bind(null, "update"),
    }
}
