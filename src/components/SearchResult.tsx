import {Box, Card, CardActionArea, CardContent, Typography} from "@mui/material"
import {Employee} from "@/types/Employee";

interface SearchResultProps {
    employee: Employee;
}

export function SearchResult({employee}: SearchResultProps) {
    return (
        <Box>
            <Card elevation={3} sx={{margin: "15px", cursor: "pointer"}}>
                <CardActionArea>
                    <CardContent>
                        <Typography variant="h6">{employee.first_name} ({employee.employee_id})</Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
        </Box>
    )
}