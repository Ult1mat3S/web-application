export default function App() {
  return (
    <div className="App">
      <h1>App</h1>
      <form action="http://localhost:5174/signup" method="post">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          name="email"
          id="email"
          defaultValue="example@example.com"
          autoComplete="email"
        />
        <br />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          id="password"
          defaultValue="password123"
          autoComplete="password"
        />
        <br />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
