import * as React from 'react';
import { InputWithLable } from './Input';
import { List } from './List';
import { getAsyncStories } from './GetAsyncStories';
import { useStorageState } from './UseStorageState';

const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=';

const App = () => {

  const [searchTerm, setSearchTerm] = useStorageState('search', 'React');

  const [url, setUrl] = React.useState(
    `${API_ENDPOINT}${searchTerm}`
  );

  const handleFetchStories = React.useCallback(async() => {
    dispatchStories({ type: 'STORIES_FETCH_INIT' });
    try {
      const result = await getAsyncStories(url);
      dispatchStories({
        type: 'STORIES_FETCH_SUCCESS',
        payload: result.hits,
      });
      } catch {
        dispatchStories({ type: 'STORIES_FETCH_FAILURE' });
      }
      }, [url]);


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
    // const handleFetchStories = React.useCallback(() => {
    //   if (!searchTerm) return;

    //   dispatchStories({ type: 'STORIES_FETCH_INIT' });
  
    //   fetch(url)
    //     .then(response => response.json())
    //     .then(result => {
    //       dispatchStories({
    //         type: 'STORIES_FETCH_SUCCESS',
    //         payload: result.hits,
    //       });
    //       setIsLoading(false);
    //     })
    //     .catch(() => 
    //       dispatchStories({ type: 'STORIES_FETCH_FAILURE' })
    //     );
    // }, [url]);

    React.useEffect(() => {
      handleFetchStories();
    }, [handleFetchStories]);

  const handleRemoveStory = (item) => {
    dispatchStories({
      type: 'REMOVE_STORIES',
      payload: item,
    });
  };

  // const handleSearch = (event) => {
  //   setSearchTerm(event.target.value); // то, что мы вбиваем в инпут поиска
  // };

  const handleSearchInput = (event) => {
    setSearchTerm(event.target.value); // то, что мы вбиваем в инпут поиска
  };

  const handleSearchSubmit = () => {
    setUrl(`${API_ENDPOINT}${searchTerm}`);
  };

  return (
    <div>
      <h1>My stories</h1>
      <InputWithLable
        id="search"
        value={searchTerm}
        isFocused
        onInputChange={handleSearchInput}
      ><strong>Search:</strong>
        </InputWithLable>

        <button
          type="button"
          disabled={!searchTerm} // если нет searchTerm, то кнопка disabled
          onClick={handleFetchStories}
          >
            Submit
        </button>

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


