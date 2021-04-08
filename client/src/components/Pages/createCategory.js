/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useState, useContext, useEffect } from "react";
import categoryAPI from "./../APIs/catergoryAPI";
import axios from "axios";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");
  const [onEdit, setOnEdit] = useState(false);
  const [id, setID] = useState("");
  const [callback, setCallback] = useState(false);

  useEffect(() => {
    const getCategories = async () => {
      const res = await categoryAPI.getAllCategory();
      setCategories(res.data);
    };
    getCategories();
  });

  const createCategory = async (e) => {
    e.preventDefault();
    try {
      if (onEdit) {
        const res = await categoryAPI.editCategory(id, category);
        alert(res.data.msg);
      } else {
        const res = await categoryAPI.createCategory({ name: category });
        alert(res.data.msg);
      }
      setOnEdit(false);
      setCategory("");
      setCallback(!callback);
    } catch (err) {
      console.log(err);
      alert(err.response.data.msg);
    }
  };

  const editCategory = async (id, name) => {
    console.log(id);
    console.log(name);
    setID(id);
    setCategory(name);
    setOnEdit(true);
  };

  const deleteCategory = async (id) => {
    try {
      const res = await categoryAPI.deleteCategoryById(id);
      alert(res.data.msg);
      setCallback(!callback);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="categories">
      <form
        onSubmit={(e) => {
          createCategory(e);
        }}
      >
        <label htmlFor="category">Category</label>
        <input
          type="text"
          name="category"
          value={category}
          required
          onChange={(e) => setCategory(e.target.value)}
        />

        <button type="submit">{onEdit ? "Update" : "Create"}</button>
      </form>

      <div className="col">
        {categories.map((category) => (
          <div className="row" key={category._id}>
            <p>{category.name}</p>
            <div>
              <button
                onClick={(e) => editCategory(category._id, category.name)}
              >
                Edit
              </button>
              <button onClick={(e) => deleteCategory(category._id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Categories;
