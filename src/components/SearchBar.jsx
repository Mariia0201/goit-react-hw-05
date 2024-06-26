import { Field, Form, Formik } from "formik";
import css from "./SearchBar.module.css";

const SearchBar = ({ onSubmit }) => {
  const handleSubmit = (values, actions) => {
    const formattedSearch = values.query.trim().toLowerCase(); 
    onSubmit(formattedSearch);
    actions.resetForm();
  };

  return (
    <header>
      <Formik
        initialValues={{ query: "" }}
        onSubmit={handleSubmit} 
      >
        <Form className={css.formSearch}>
          <Field
            className={css.input}
            placeholder="Search movies"
            type="text"
            name="query"
          />
          <button className={css.btn} type="submit">
            Search
          </button>
        </Form>
      </Formik>
    </header>
  );
};

export default SearchBar;