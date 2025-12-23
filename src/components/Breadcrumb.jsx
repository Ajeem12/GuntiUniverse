


import { Link, useLocation } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import { useCategories } from "../hooks/useCategories";
import hashids from "../util/hashids";

const Breadcrumbs = ({ catId }) => {
  const { data } = useCategories();
  const location = useLocation();

  const rawSegments = location.pathname.split("/").filter(Boolean);
  const segments = rawSegments.filter(
    (segment) => segment.toLowerCase() !== "category"
  );

  const formatSegment = (segment) =>
    segment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

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
        const encodedId = hashids.encode(category.id);
        const isLast = index === categoryPath.length - 1;
        const targetUrl = `/category?catId=${encodedId}`;

        return (
          <span key={index} className="flex items-center gap-1">

            {isLast && (
              <>
                <span className="mx-1">{">"}</span>
                <span className="text-black font-medium">{category.name}</span>
              </>
            )}
          </span>
        );
      })}

      {/* Fallback to URL segments if no catId */}
      {!catId &&
        segments.map((segment, index) => {
          const path = "/" + rawSegments.slice(0, index + 1).join("/");
          const isLast = index === segments.length - 1;
          const name = formatSegment(segment);

          return (
            <span key={index} className="flex items-center gap-1">
              <span className="mx-1">{">"}</span>
              {isLast ? (
                <span className="text-black font-medium">{name}</span>
              ) : (
                <Link to={path} className="text-gray-600 hover:text-black">
                  {/* { name } */}
                </Link>
              )
              }
            </span>
          );
        })}
    </div >
  );
};

export default Breadcrumbs;
