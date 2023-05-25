import * as React from 'react';
import { InputWithLabel } from './Input';
import { List } from './List';
import { useStorageState } from './UseStorageState';
import axios from 'axios';
// import fdxfgcxfnbcfb ncnb ncfht from './Form';

const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=';

const App = () => {

  const [searchTerm, setSearchTerm] = useStorageState('search', 'React');

  const [url, setUrl] = React.useState(
    `${API_ENDPOINT}${searchTerm}`
  );

  const handleSearchInput = (event) => {
    setSearchTerm(event.target.value); // то, что мы вбиваем в инпут поиска
  };

  const handleSearchSubmit = () => {
    setUrl(`${API_ENDPOINT}${searchTerm}`);
    event.preventDefault();
  };

  const storiesReducer = (state, action) => {
    switch (action.type) {
      case 'STORIES_FETCH_INIT':
        return {
          ...state,
          isLoading: true,
          isError: false,
        };
      case 'STORIES_FETCH_SUCCESS':
        return {
          ...state,
          isLoading: false,
          isError: false,
          data: action.payload,
        };
      case 'STORIES_FETCH_FAILURE':
        return {
          ...state,
          isLoading: false,
          isError: true,
        };
      case 'REMOVE_STORY':
        return {
          ...state,
          data: state.data.filter(
            story => action.payload.objectID !== story.objectID
          ),
        };
      default:
        throw new Error();
    }
  };
  
  const [stories, dispatchStories] = React.useReducer(
    storiesReducer,
    { data: [], isLoading: false, isError: false }
  );

  const handleFetchStories = React.useCallback(async() => {
    dispatchStories({ type: 'STORIES_FETCH_INIT' });
    try {
      const result = await axios.get(url);
      dispatchStories({
        type: 'STORIES_FETCH_SUCCESS',
        payload: result.data.hits,
      });
    } catch {
      dispatchStories({ type: 'STORIES_FETCH_FAILURE' });
    }
  }, [url]);

    React.useEffect(() => {
      handleFetchStories();
    }, [handleFetchStories]);

  const handleRemoveStory = (item) => {
    dispatchStories({
      type: 'REMOVE_STORIES',
      payload: item,
    });
  };
 
  return (
    <div>
      <h1>My stories</h1>
<List list={stories.data} onRemoveItem={handleRemoveStory}/>
      <hr />
    <SearchForm searchTerm={searchTerm} 
        onSearchInput={onSearchInput} 
        onSearchSubmit={onSearchSubmit}
        handleSearchSubmit={handleSearchSubmit}></SearchForm>
      {stories.isError && <p>Something went wrong ...</p>}

      {stories.isLoading ? (
        <p>Loading ...</p>
      ) : (
      <List list={stories.data} onRemoveItem={handleRemoveStory}/>
      )}
    </div> 
  )
};

export default {App, handleSearchSubmit};
