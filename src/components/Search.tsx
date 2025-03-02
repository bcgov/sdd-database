import {Button, Form, TextField} from "@bcgov/design-system-react-components";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import {SearchResult} from "@/components/SearchResult";
import {Entity} from "@/types/Entity";

interface SearchProps {
    searchPhrase: string;
    searchResults: Entity[];
    searchResultClickHandler: (item: Entity) => void;
    handleSearch: (formData: FormData) => Promise<void>;
}

export function Search({searchPhrase, searchResults, searchResultClickHandler, handleSearch}: SearchProps) {

    function getSearchResultKey(item: Entity) {

        // Determine a unique key based on the discriminant property
        let key: string;

        if (item.type === "employee") {
            key = item.employee_id;
        } else {
            key = item.office_number;
        }

        return key
    }

    return (
        <>
            {/* Search Bar */}
            <Form action={handleSearch}>
                <TextField type="search" name="search" iconLeft=<SearchOutlinedIcon/>/>
                <Button type="submit">Search</Button>
            </Form>

            {/* Search Results (/List) */}
            {searchPhrase && searchResults.length === 0 ? (
                <p> No results founds</p>
            ) : (
                searchResults.map(item =>
                    <SearchResult key={getSearchResultKey(item)}
                                  item={item}
                                  searchResultClickHandler={searchResultClickHandler}
                    />
                )
            )}
        </>
    )
}
