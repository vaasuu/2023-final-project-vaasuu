import { useContext, useState } from "react";
import { AuthContext } from "../../../shared/context/auth-context";
import { getCategories } from "../../../api/listings/listings";
import { useQuery } from "react-query";
import currencyCodes from "currency-codes";

import "./ListingForm.css";

const ListingForm = ({
  formData,
  setFormData,
  handleSubmit,
  errorMsg,
  submitButtonText,
}) => {
  const auth = useContext(AuthContext);
  const [categories, setCategories] = useState([]);

  useQuery({
    queryKey: ["categories", auth.token],
    queryFn: () => getCategories(auth.token),
    onSuccess: (data) => {
      const categories = data.categories.map((category) => category.name);
      setCategories(categories);
    },
    enabled: !categories.length, // only fetch categories if they haven't been fetched yet.
    // This is to prevent the custom category input from being reset accidentally during form filling.
  });

  const handleChange = (event) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [event.target.name]: event.target.value,
    }));
  };

  const handleImageAdd = (event) => {
    event.preventDefault();
    setFormData((prevFormData) => ({
      ...prevFormData,
      image_urls: [...prevFormData.image_urls, event.target.value],
    }));
  };

  const clearImageUrl = (url) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      image_urls: prevFormData.image_urls.filter(
        (imageUrl) => imageUrl !== url
      ),
    }));
  };

  return (
    <form className="listing-form" onSubmit={handleSubmit}>
      <label htmlFor="title">Title</label>
      <input
        type="text"
        id="title"
        name="title"
        value={formData.title}
        onChange={handleChange}
        required
        maxLength={255}
      />
      <label htmlFor="description">Description</label>
      <textarea
        id="description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        required
        maxLength={4095}
      />
      <label htmlFor="category">Category</label>
      <select
        id="category"
        name="category"
        value={formData.category}
        onChange={handleChange}
        required
      >
        <option value="">--Please choose a category--</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
        <option value="other">other</option>
      </select>
      {formData.category === "other" && (
        <>
          <label htmlFor="category">Create a new category</label>
          <input
            type="text"
            id="category"
            name="category"
            onBlur={(e) => {
              if (e.target.value === "") {
                return; // do nothing if the user didn't enter a category
              }
              // add the new category to the list of categories
              setCategories((prevCategories) => [
                ...prevCategories,
                e.target.value.toLowerCase(),
              ]);

              // update the form data
              setFormData((prevFormData) => ({
                ...prevFormData,
                category: e.target.value.toLowerCase(), // doing this here to make sure the category is lowercase. handleChange needs to support both cases. This is a bit hacky.
              }));
            }}
            required
            maxLength={255}
          />
        </>
      )}
      <label htmlFor="price">Price</label>
      <input
        type="number"
        id="price"
        name="price"
        value={formData.price}
        onChange={handleChange}
        required
        min={0}
        max={99_999_999}
      />
      <label htmlFor="currency">Currency</label>
      <select
        id="currency"
        name="currency"
        value={formData.currency}
        onChange={handleChange}
        required
      >
        <option value="">--Please choose a currency--</option>
        {currencyCodes.data.map((data) => (
          <option key={data.code} value={data.code}>
            {data.currency}
          </option>
        ))}
      </select>
      <label htmlFor="location">Location</label>
      <input
        type="text"
        id="location"
        name="location"
        value={formData.location}
        onChange={handleChange}
        required
        maxLength={255}
      />
      <label htmlFor="image_urls">Image URLs</label>
      <ul className="listing-form__image-urls-list">
        {formData.image_urls.map((imageUrl) => (
          <li key={imageUrl}>
            <a href={imageUrl} target="_blank" rel="noreferrer">
              {imageUrl}
            </a>
            <button onClick={() => clearImageUrl(imageUrl)}>X</button>
          </li>
        ))}
      </ul>
      <label htmlFor="image_urls">
        Add an https image URL (jpg & png only)
      </label>
      <input
        type="url"
        id="image_urls"
        name="image_urls"
        maxLength={1000}
        pattern="https://.+"
        placeholder="https://..."
        onBlur={async (e) => {
          if (e.target.value === "") {
            return; // do nothing if the user didn't enter a url
          }

          if (formData.image_urls.includes(e.target.value)) {
            // don't add the image url if it's already in the list
            e.target.value = "";
            return;
          }

          if (!e.target.reportValidity()) {
            // don't add the image url if it's not a valid url
            return;
          }

          await handleImageAdd(e); // add the image url to the list of image urls
          e.target.value = ""; // clear the input after adding the image url
        }}
      />

      <input type="submit" value={submitButtonText} />
      <p role="alert" className="error">
        {errorMsg}
      </p>
    </form>
  );
};

export default ListingForm;
