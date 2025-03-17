import {Box, Card, CardActionArea, CardActions, CardContent} from "@mui/material"

import {Button, Text} from "@bcgov/design-system-react-components";

import {Entity} from "@/types/Entity";

import {getEmployeeFullName} from "@/utils";


interface SearchResultProps {
    item: Entity;
    searchResultClickHandler: (item: Entity) => void;
    assignMode: boolean;
}

export function SearchResult({item, searchResultClickHandler, assignMode}: SearchResultProps) {

    function getSearchResultCardTitle() {

        let title = "";

        if (item.type === "employee") {
            title = `${getEmployeeFullName(item)} (${item.employee_id})`
        } else {
            title = `${item.office_name} (${item.office_number})`
        }

        return title
    }

    return (
        <Box>
            <Card elevation={3} sx={{margin: "15px", display: "flex"}}>

                <CardActionArea onClick={assignMode ? undefined : () => searchResultClickHandler(item)}
                                sx={{cursor: "pointer"}}>
                    <CardContent>
                        <Text size="large">{getSearchResultCardTitle()}</Text>
                    </CardContent>
                </CardActionArea>

                {
                    assignMode &&
                    <CardActions>
                        <Button>Assign</Button>
                    </CardActions>
                }
            </Card>
        </Box>
    )
}
