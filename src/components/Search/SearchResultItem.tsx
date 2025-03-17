import {Box, Card, CardActionArea, CardActions, CardContent} from "@mui/material"

import {Button, Text} from "@bcgov/design-system-react-components";


interface SearchResultItemProps {
    title: string;
    searchResultClickHandler: () => void;
    assignMode: boolean;
}

export function SearchResultItem({title, searchResultClickHandler, assignMode}: SearchResultItemProps) {
    return (
        <Box>
            <Card elevation={3} sx={{margin: "15px", display: "flex"}}>

                <CardActionArea onClick={assignMode ? undefined : searchResultClickHandler}
                                sx={{cursor: "pointer"}}>
                    <CardContent>
                        <Text size="large">{title}</Text>
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
