const matchContainer = document.querySelector(".all-matches");
const addMatchBtn = document.querySelector(".lws-addMatch");
const resetBtn = document.querySelector(".lws-reset");

//Constant
const INCREMENT = "increment";
const DECREMENT = "decrement";
const RESET = "reset";
const ADD_MATCH = "add_match";
const DELETE_MATCH = "delete_match";

//initial state
const initialState = [
  {
    id: 1,
    score: 0,
  },
];

//Actions

const increment = (payload) => {
  return {
    type: INCREMENT,
    payload,
  };
};

const decrement = (payload) => {
  return {
    type: DECREMENT,
    payload,
  };
};

const reset = () => {
  return {
    type: RESET,
  };
};

const addMatch = () => {
  return {
    type: ADD_MATCH,
  };
};
const deleteMatch = (matchId) => {
  return {
    type: DELETE_MATCH,
    payload: matchId,
  };
};

//get unique id

const nextMatchId = (matches) => {
  const maxId = matches.reduce((maxId, match) => Math.max(match.id, maxId), -1);
  return maxId + 1;
};

//Reducer

const matchReducer = (state = initialState, action) => {
  //Increment
  if (action.type === INCREMENT) {
    const newMatches = state.map((item) => {
      if (item.id === action.payload.id) {
        return {
          ...item,
          score: item.score + Number(action.payload.value),
        };
      } else {
        return item;
      }
    });
    return newMatches;
  }
  //Decrement
  else if (action.type === DECREMENT) {
    const newMatches = state.map((item) => {
      if (item.id === action.payload.id) {
        const newScore = item.score - Number(action.payload.value);
        return {
          ...item,
          score: newScore > 0 ? newScore : 0,
        };
      } else {
        return item;
      }
    });
    return newMatches;
  }
  // Reset Score
  else if (action.type === RESET) {
    const resetScore = state.map((item) => ({ ...item, score: 0 }));
    return resetScore;
  }
  //add match
  else if (action.type === ADD_MATCH) {
    const id = nextMatchId(state);
    return [
      ...state,
      {
        id,
        score: 0,
      },
    ];
  }
  //delete match
  else if (action.type === DELETE_MATCH) {
    const newMatches = state.filter((match) => match.id != action.payload);
    return newMatches;
  } else {
    return state;
  }
};

//create store

const store = Redux.createStore(matchReducer);


//Increment score handler

const incrementHandler = (id, formEl) => {
  const input = formEl.querySelector(".lws-increment");
  const value = Number(input.value);
  if (value > 0) {
    store.dispatch(increment({ id, value }));
  }
};

//Decrement score handler
const decrementHandler = (id, formEl) => {
  const input = formEl.querySelector(".lws-decrement");
  const value = Number(input.value);
  if (value > 0) {
    store.dispatch(decrement({ id, value }));
  }
};

//Delete match
const handleDeleteMatch = (matchId) => {
  store.dispatch(deleteMatch(matchId));
};

//Add match

addMatchBtn.addEventListener("click", () => {
  store.dispatch(addMatch());
});

//reset

resetBtn.addEventListener("click", () => {
  store.dispatch(reset());
});

//render function

const render = () => {
  const state = store.getState();
  const matchView = state.map((item) => {
    return `<div class="match" id="match1">
    <div class="wrapper">
        <button class="lws-delete" onclick="handleDeleteMatch(${item.id})">
            <img src="./image/delete.svg" alt="" />
        </button>
        <h3 class="lws-matchName">Match ${item.id}</h3>
    </div>
    <div class="inc-dec">
        <form class="incrementForm" onsubmit="event.preventDefault();incrementHandler(${item.id},this)">
            <h4>Increment</h4>
            <input
                type="number"
                name="increment"
                class="lws-increment"
            />
        </form>
        <form class="decrementForm" onsubmit="event.preventDefault();decrementHandler(${item.id},this)" >
            <h4>Decrement</h4>
            <input
                type="number"
                name="decrement"
                class="lws-decrement"
            />
        </form>
    </div>
    <div class="numbers">
        <h2 class="lws-singleResult" >${item.score}</h2>
    </div>
</div> 
    `;
  }).join("");
  matchContainer.innerHTML = matchView;
};


// render initially
 
render();

store.subscribe(render);