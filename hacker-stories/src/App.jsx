import * as React from 'react';
import { InputWithLable } from './Input';
import { List } from './List';
import { getAsyncStories } from './GetAsyncStories';
import { useStorageState } from './UseStorageState';

const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=';

const App = () => {

  const [searchTerm, setSearchTerm] = useStorageState('search', 'React');

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
    React.useEffect(() => {;
      if (!searchTerm) return;

      dispatchStories({ type: 'STORIES_FETCH_INIT' });
  
      fetch(`${API_ENDPOINT}${searchTerm}`)
        .then(response => response.json())
        .then(result => {
          dispatchStories({
            type: 'STORIES_FETCH_SUCCESS',
            payload: result.hits,
          });
          setIsLoading(false);
        })
        .catch(() => 
          dispatchStories({ type: 'STORIES_FETCH_FAILURE' })
        );
    }, [searchTerm]);

  const handleRemoveStory = (item) => {
    dispatchStories({
      type: 'REMOVE_STORIES',
      payload: item,
    });
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value); // то, что мы вбиваем в инпут поиска
  };

  return (
    <div>
      <h1>My stories</h1>
      <InputWithLable
        id="search"
        value={searchTerm}
        isFocused
        onInputChange={handleSearch}
      ><strong>Search:</strong>
        </InputWithLable>
      <hr />

      {stories.isError && <p>Something went wrong ...</p>}

      {stories.isLoading ? (
        <p>Loading ...</p>
      ) : (
      <List list={stories.data} onRemoveItem={handleRemoveStory}/>
      )}
    </div> 
  )
};

export default App;

