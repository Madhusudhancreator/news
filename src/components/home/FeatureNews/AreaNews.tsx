import Btn from "../../common/Btn";

const AreaNews: React.FC = () => {
  return (
    <div>
      
      <div className="flex items-center justify-center border bg-base-content shadow-md rounded-xl mb-2">
        <div className="max-w-[400px] text-white text-2xl py-2 cursor-pointer">
        Local News
        </div>
      </div>
      <div className=" max-w-[400px] mx-auto  bg-white rounded-xl shadow-md px-4 py-4">
        <div className=" ">
          <label
            htmlFor="division"
            className="block text-base xl:text-xl font-medium text-gray-900"
          >
            Division
          </label>
          <select
            id="division"
            name="division"
            defaultValue="Division"
            className="mt-1 block w-full rounded-md border-0 py-3 text-base xl:text-xl px-3 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-300 "
          >
            <option className="text-sm">Select</option>
            <option>Division</option>
          </select>
        </div>
        <div className=" pt-2">
          <label
            htmlFor="district"
            className="block text-base xl:text-xl font-medium text-gray-900"
          >
            District
          </label>
          <select
            id="district"
            name="district"
            defaultValue="District"
            className="mt-1 block w-full rounded-md border-0 py-3 text-base xl:text-xl px-3 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-300 "
          >
            <option className="text-sm">Select</option>
            <option>District</option>
          </select>
        </div>
        <div className=" pt-2 mb-4">
          <label
            htmlFor="subdistrict"
            className="block text-base xl:text-xl font-medium text-gray-900"
          >
            Sub-district
          </label>
          <select
            id="subdistrict"
            name="subdistrict"
            defaultValue="Sub-district"
            className="mt-1 block w-full rounded-md border-0 py-3 text-base xl:text-xl px-3 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-300 "
          >
            <option className="text-sm">Select</option>
            <option>Sub-district</option>
          </select>
        </div>

        <Btn text="Search" />
      </div>
    </div>
  );
};

export default AreaNews;
