# Extracted Comments from Front-End `src/`

This file contains all comments removed from the source files under `src/` so you can read them later. Each section lists the original file path and the comment lines (with approximate context).

---

## src/Pages/Home.jsx
- // Home.jsx
- // The main landing page after login. It fetches and displays all users
- // as cards. Clicking a user card navigates to their profile page where
- // reviews can be seen.
- // Home page component
- // useNavigate is available for any additional programmatic navigation
- // `users` stores the list fetched from the backend
- // `loading` indicates whether we are currently fetching data
- // `error` stores friendly error messages for the UI
- // Get authentication token from cookies via AuthContext so our
- // API requests include a valid credential.
- // Fetch users when the component mounts or when the token changes.
- // This keeps the list up to date for the authenticated user.
- // Send the auth token in the Authorization header
- // send token for auth
- // Shuffle users randomly so the order changes on reload
- // Called when the app title is clicked in the navbar to reshuffle users
- // Shuffle again
- // While data is loading show a friendly loading message
- {/* Navbar at the top with a reload handler */}
- {/* Display users in a responsive grid using flexbox. Each user
    is rendered as a UserCard component that links to their profile. */}

---

## src/Pages/ProfilePage.jsx
- // ProfilePage.jsx
- // Displays a single user's profile information and all reviews they've
- // received. The page fetches both the user's data and their visible reviews
- // from the backend using the ID from the URL.
- // `id` is read from the URL, e.g. /profile/123 -> id === "123"
- // Holds the profile information for the user we're viewing
- // Holds reviews written about this user
- // Loading indicator while fetching data
- // Get auth token and current user from AuthContext so API calls are authenticated
- // Prefer in-memory auth user id; fall back to cookie if present
- // Check if this is the current user's own profile
- // Fetch the user's profile and their visible reviews when the
- // component mounts or when the ID/token changes.
- // Simple local state for submitting a new review 
- // Submit a new review and then reload the visible reviews
- // Reload reviews after a successful post
- // Update profile handler (submits profile edits)
- // Convert height and weight to numbers and remove empty fields
- // Backend exposes an authenticated route to update the current
- // user's profile at PUT /api/user/profile. The server uses the
- // token to identify the user, so we should call that endpoint
- // rather than attempting to update by URL id.
- // The backend responds with { message, user: { ... } }
- // Prefer the nested user object when updating local state.
- // --- Review editing helpers (for reviews the current user posted) ---
- // Called when editing a review
- // Remove reported review from UI
- // Show friendly messages for loading / not found states
- {/* Navbar is shown at the top; on profile pages we don't need reload */}
- {/* Placeholder circular thumbnail for the user's avatar */}
- {/* Toggle edit mode button - only shown on own profile */}
- /* Show optional fields if they exist */
- {/* Review submission form */}

---

## src/Pages/register.jsx
- // register.jsx
- // This page allows new users to create an account. It calls `signUp`
- // from AuthContext and redirects to /home on success.
- // Register page component
- // get signUp helper to create new accounts
- // Controlled form state
- // Runs when the registration form is submitted. Calls signUp and
- // navigates to the home page on success or shows an error message.
- // Render the registration form. Inputs are controlled by React state.
- {/* Show errors in red to help beginners understand what went wrong */}

---

## src/Pages/Login.jsx
- // Login.jsx
- // This page allows users to sign into their account by providing
- // their email and password. It uses `useAuth()` to call the `login`
- // function and `useNavigate()` to redirect after successful login.
- // Login page component
- // get the login helper from our AuthContext
- // useNavigate lets us redirect programmatically after login
- // Controlled form state for the login inputs
- // Runs when the form is submitted. Prevents the browser's default
- // form behavior, calls the login function and navigates to /home on success.
- // Show a simple error message for beginners; backend errors
- // may contain more details in console.
- // The rendered form below is controlled by React state. When the
- // user types, we update state so `handleSubmit` can send the values.
- {/* Show a friendly error if login fails */}

---

## src/App.jsx
- // App.jsx
- // Main application router. Defines public and protected routes and wires
- // them up to the appropriate page components. Protected pages require
- // an authentication token (stored in cookies) to be visible.
- // Get auth cookies from our AuthContext. We check cookies.token to
- // determine if the user is currently authenticated.
- // ProtectedRoute is a small wrapper that only renders its children
- // when an authentication token exists. If no token is present we
- // redirect the visitor to the login page. This prevents unauthenticated
- // access to sensitive pages.
- // All application routes are declared below. Add new routes here.
- {/* Root redirects to /home */}
- {/* Home is a protected page that lists all users */}
- {/* Public pages: login and register */}
- {/* Profile pages are protected and use a dynamic :id parameter */}

---

## src/main.jsx
- (no inline comments to extract beyond imports)

---

## src/Components/NavBar.jsx
- // NavBar.jsx
- // Top navigation bar shown on most pages. Contains the app title (clickable
- // to trigger a reload/shuffle on the Home page), a placeholder Chats button,
- // and a Logout button that calls the AuthContext logout helper.
- // Programmatic navigation helper
- // Get the current URL params to check if we're on a profile page
- // Get the logout function and user info from our AuthContext
- // Prefer the in-memory `user` id, fall back to cookie if present
- // Called when the Logout button is clicked. Uses the AuthContext
- // logout helper to remove the authentication cookie and clear user state,
- // then redirects the user to the login page.
- // Use AuthContext logout to clear cookie and user state
- {/* Clicking the title goes to home and triggers reload if provided */}
- {/* Profile button - always show if user is logged in */}
- {/* Chats is not implemented yet - show a friendly message */}
- {/* Logout clears auth state and navigates to login */}

---

## src/Components/UserCard.jsx
- // UserCard.jsx
- // Displays a single user's summary as a card. If the user has a valid
- // identifier this card is clickable and navigates to /profile/{userId}.
- // useNavigate allows programmatic navigation when the card is clicked
- // Support both MongoDB `_id` and generic `id` fields
- // Only make the card interactive if we have an ID to navigate to
- // role="button" improves keyboard/screen-reader affordance when clickable
- {/* thumbnail for the user */}
- {/* Display preview information when available */}

---

## src/Components/AuthContext.jsx
- // AuthContext.jsx
- // This file manages user authentication for the app using browser cookies.
- // It provides `login`, `signUp`, and `logout` functions and exposes the
- // current `user` and cookie `cookies` to any component that needs auth info.
- // Using cookies (via react-cookie) is generally more secure than storing
- // tokens in localStorage for this application.
- // Create a React Context to share authentication state and helpers
- // across the whole component tree without prop drilling.
- // `useCookies` gives us helpers to read, set and remove cookies.
- // We store the authentication token in a cookie named "token".
- // `user` holds the currently logged-in user's information (if any).
- // Backend API base URL. If deploying, update this to the real backend.
- // Login function
- // Accepts an object like { email, password } and sends it to the backend.
- // On success the backend returns a token and user info. We store the token
- // in a cookie (so it's automatically sent on same-site requests if configured)
- // and update `user` so the UI knows who's logged in.
- // Store token in cookie so it can be used for authenticated requests.
- // We set path:"/" so the cookie is available across the whole app.
- // Save user details in state so components can render user-specific UI.
- // Register function
- // Similar to login but creates a new user account first. On success
- // the backend returns a token and user data which we save the same way.
- // Logout function
- // Removing the token cookie and clearing the user state fully logs
- // the current user out of the application.
- // Provide auth helpers and state to children components via Context.
- // Custom hook for components to access authentication data and helpers.

---

## src/Styles/Homepage.css
- /* Main container for all user cards */
- /* Each user card */
- /* Hover effect */

---

## src/Styles/NavBar.css
- /* Fixed top navbar */
- /* App title (ReviewApp) */
- /* Buttons in the navbar */
- /* Make sure page content isn't hidden under the fixed navbar */

---

## src/Styles/login.css
- (mostly styling rules; no explanatory comments beyond CSS declarations)

---

## src/Styles/Profile.css
- (styling rules only; no explanatory comments)

---

## src/index.css
- (no comments)

---

## src/App.css
- (no comments)


---

If you want me to proceed, I'll now remove the above comments from the source files and save them. I will keep the extracted `COMMENTS_EXTRACT.md` in the project root `Front-End/ProfileReviewFE/` so you can read them later.
