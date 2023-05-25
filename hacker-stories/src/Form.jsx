import React from 'react';
import InputWithLabel from './Input';

const SearchForm = ({
    searchTerm,
    onSearchInput,
    onSearchSubmit,
    handleSearchSubmit
    }) => (
    <form onSubmit={handleSearchSubmit}>
        <InputWithLabel
            id="search"
            value={searchTerm}
            isFocused
            onInputChange={handleSearchInput}
            >
                <strong>Search:</strong>
        </InputWithLabel>

        <button
            type="submit"
            disabled={!searchTerm} // если нет searchTerm, то кнопка disabled
            onClick={handleSearchSubmit}
        >
            Submit
        </button>
    </form>
);

export default SearchForm;