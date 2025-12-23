// import { Link, useLocation } from "react-router-dom";
// import HomeIcon from "@mui/icons-material/Home";
// import { useCategories } from "../hooks/useCategories";
// import hashids from "../util/hashids"; // Ensure the path is correct

// const ProductBreadcrumb = ({ catId }) => {
//   const { data } = useCategories();
//   const location = useLocation();

//   // Ensure we have a valid catId from the query parameter
//   if (!catId) {
//     return <div>Invalid Category ID</div>;
//   }

//   const findCategoryById = (id) => {
//     return data?.data?.find((cat) => cat.id === id);
//   };

//   const buildCategoryPath = (categoryId) => {
//     const path = [];
//     let currentId = categoryId;
//     const seen = new Set();

//     while (currentId) {
//       const category = findCategoryById(currentId);
//       if (!category) break;

//       if (!seen.has(category.parentcate)) {
//         path.unshift({
//           name: category.parentcate,
//           id: category.id,
//         });
//         seen.add(category.parentcate);
//       }

//       currentId = category.type !== 0 ? category.type : null;
//     }

//     return path;
//   };

//   const categoryPath = catId ? buildCategoryPath(catId) : [];
//   console.log(categoryPath);


//   // Function to create a readable URL for category names
//   const createCategoryUrl = (category) => {
//     // Replace spaces with dashes and encode the name to handle special characters
//     const categorySlug = category.name
//       .toLowerCase()
//       .replace(/[\s,]+/g, '-') // Replace spaces and commas with dashes
//       .replace(/&/g, 'and'); // Replace ampersands with 'and'
//     return `/category/${categorySlug}?catId=${hashids.encode(category.id)}`;
//   };



//   return (
//     <div className="text-sm text-gray-600 flex items-center flex-wrap gap-1">
//       <Link
//         to="/home"
//         className="flex items-center gap-1 text-gray-600 hover:text-black"
//       >
//         <HomeIcon fontSize="small" />
//         <span>Home</span>
//       </Link>

//       {/* Render breadcrumb items from category path */}
//       {categoryPath.map((category, index) => {
//         const isLast = index === categoryPath.length - 1;
//         const targetUrl = createCategoryUrl(category);

//         return (
//           <span key={index} className="flex items-center gap-1">
//             <span className="mx-1">{">"}</span>
//             {isLast ? (
//               <span className="text-black font-medium">{category.name}</span>
//             ) : (
//               <Link to={targetUrl} className="text-gray-600 hover:text-black">
//                 {category.name}
//               </Link>
//             )}
//           </span>
//         );
//       })}
//     </div>
//   );
// };

// export default ProductBreadcrumb;

import { Link, useLocation } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import { useCategories } from "../hooks/useCategories";
import hashids from "../util/hashids";

const ProductBreadcrumb = ({ catId }) => {
  const { data } = useCategories();
  const location = useLocation();

  if (!catId) {
    return <div>Invalid Category ID</div>;
  }

  const findCategoryById = (id) => {
    return data?.data?.find((cat) => cat.id === id);
  };

  const buildCategoryPath = (categoryId) => {
    const path = [];
    let currentId = categoryId;
    const seen = new Set();

    while (currentId) {
      const category = findCategoryById(currentId);
      if (!category) break;

      if (!seen.has(category.parentcate)) {
        path.unshift({
          name: category.parentcate,
          id: category.id,
        });
        seen.add(category.parentcate);
      }

      currentId = category.type !== 0 ? category.type : null;
    }

    return path;
  };

  const categoryPath = catId ? buildCategoryPath(catId) : [];

  // Function to create a readable URL for category names
  const createCategoryUrl = (category, index) => {
    // For the first category (index 0), link to "/category"
    if (index === 0) {
      return "/category";
    }
    // For other categories, use the normal URL format
    const categorySlug = category.name
      .toLowerCase()
      .replace(/[\s,]+/g, '-')
      .replace(/&/g, 'and');
    return `/category/${categorySlug}?catId=${hashids.encode(category.id)}`;
  };

  return (
    <div className="text-sm text-gray-600 flex items-center flex-wrap gap-1">
      <Link
        to="/home"
        className="flex items-center gap-1 text-gray-600 hover:text-black"
      >
        <HomeIcon fontSize="small" />
        <span>Home</span>
      </Link>

      {/* Render breadcrumb items from category path */}
      {categoryPath.map((category, index) => {
        const isLast = index === categoryPath.length - 1;
        const targetUrl = createCategoryUrl(category, index);
        return (
          <span key={index} className="flex items-center gap-1">
            <span className="mx-1">{">"}</span>
            {isLast ? (
              <span className="text-black font-medium">{category.name}</span>
            ) : (
              <Link to={targetUrl} className="text-gray-600 hover:text-black">
                {category.name}
              </Link>
            )}
          </span>
        );
      })}
    </div>
  );
};

export default ProductBreadcrumb;