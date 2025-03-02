import {Box, Card, CardActionArea, CardContent, Typography} from "@mui/material"

import {Entity} from "@/types/Entity";

import {getEmployeeFullName} from "@/utils";

interface SearchResultProps {
    item: Entity;
    searchResultClickHandler: (item: Entity) => void;
}

export function SearchResult({item, searchResultClickHandler}: SearchResultProps) {

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
            <Card elevation={3} sx={{margin: "15px", cursor: "pointer"}}>
                <CardActionArea onClick={() => searchResultClickHandler(item)}>
                    <CardContent>
                        <Typography variant="h6">{getSearchResultCardTitle()}</Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
        </Box>
    )
}
