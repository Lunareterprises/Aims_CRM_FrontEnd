// import React from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
// import Table from "react-bootstrap/Table";
// import Button from "react-bootstrap/Button";
// import { BiTrash } from "react-icons/bi";
// import EditableField from "./EditableField";

// const InvoiceItem = ({
//   items,
//   onItemizedItemEdit,
//   currency,
//   onRowDel,
//   onRowAdd,
// }) => {
//   return (
//     <div>
//       <Table>
//         <thead>
//           <tr>
//             <th>ITEM</th>
//             <th>QTY</th>
//             <th>PRICE/RATE</th>
//             <th className="text-center">ACTION</th>
//           </tr>
//         </thead>
//         <tbody>
//           {items.map((item) => (
//             <ItemRow
//               key={item.id}
//               item={item}
//               onItemizedItemEdit={onItemizedItemEdit}
//               onDelEvent={onRowDel}
//               currency={currency}
//             />
//           ))}
//         </tbody>
//       </Table>
//       <Button className="fw-bold btn-secondary" onClick={onRowAdd}>
//         Add Item
//       </Button>
//     </div>
//   );
// };

// const ItemRow = ({ item, onItemizedItemEdit, onDelEvent, currency }) => {
//   const handleDelete = () => {
//     onDelEvent(item);
//   };

//   return (
//     <tr>
//       <td style={{ width: "100%" }}>
//         <EditableField
//           onItemizedItemEdit={onItemizedItemEdit}
//           cellData={{
//             type: "text",
//             name: "name",
//             placeholder: "Item name",
//             value: item.name,
//             id: item.id,
//           }}
//         />
//         <EditableField
//           onItemizedItemEdit={onItemizedItemEdit}
//           cellData={{
//             type: "text",
//             name: "description",
//             placeholder: "Item description",
//             value: item.description,
//             id: item.id,
//           }}
//         />
//       </td>
//       <td style={{ minWidth: "70px" }}>
//         <EditableField
//           onItemizedItemEdit={onItemizedItemEdit}
//           cellData={{
//             type: "number",
//             name: "quantity",
//             min: 1,
//             step: "1",
//             value: item.quantity,
//             id: item.id,
//           }}
//         />
//       </td>
//       <td style={{ minWidth: "130px" }}>
//         <EditableField
//           onItemizedItemEdit={onItemizedItemEdit}
//           cellData={{
//             leading: currency,
//             type: "number",
//             name: "price",
//             min: 1,
//             step: "0.01",
//             presicion: 2,
//             textAlign: "text-end",
//             value: item.price,
//             id: item.id,
//           }}
//         />
//       </td>
//       <td className="text-center" style={{ minWidth: "50px" }}>
//         <BiTrash
//           onClick={handleDelete}
//           style={{ height: "33px", width: "33px", padding: "7.5px" }}
//           className="text-white mt-1 btn btn-danger"
//         />
//       </td>
//     </tr>
//   );
// };

// export default InvoiceItem;


import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import { BiTrash } from "react-icons/bi";
import EditableField from "./EditableField";

const InvoiceItem = ({
  items,
  onItemizedItemEdit,
  currency,
  onRowDel,
  onRowAdd,
}) => {
  return (
    <div>
      <Table>
        <thead>
          <tr>
            <th>ITEM</th>
            <th>QTY</th>
            <th>PRICE/RATE</th>
            <th>DISCOUNT (%)</th>
            <th>SUBTOTAL</th>
            <th className="text-center">ACTION</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <ItemRow
              key={item.id}
              item={item}
              onItemizedItemEdit={onItemizedItemEdit}
              onDelEvent={onRowDel}
              currency={currency}
              
            />
          ))}
        </tbody>
      </Table>
      <Button className="fw-bold btn-secondary" onClick={onRowAdd}>
        Add Item
      </Button>
    </div>
  );
};

const ItemRow = ({ item, onItemizedItemEdit, onDelEvent, currency }) => {
  const handleDelete = () => {
    onDelEvent(item);
  };

  // Calculate item subtotal after discount
  const calculateSubtotal = () => {
    const price = parseFloat(item.price) || 0;
    const quantity = parseInt(item.quantity) || 0;
    const discountRate = parseFloat(item.discount) || 0;
    const discountAmount = (price * quantity * discountRate) / 100;
    return (price * quantity - discountAmount).toFixed(2);
  };

  return (
    <tr>
      <td style={{ width: "100%" }}>
        <EditableField
          onItemizedItemEdit={onItemizedItemEdit}
          cellData={{
            type: "text",
            name: "name",
            placeholder: "Item name",
            value: item.name,
            id: item.id,
          }}
        />
        <EditableField
          onItemizedItemEdit={onItemizedItemEdit}
          cellData={{
            type: "text",
            name: "description",
            placeholder: "Item description",
            value: item.description,
            id: item.id,
          }}
        />
      </td>
      <td style={{ minWidth: "70px" }}>
        <EditableField
          onItemizedItemEdit={onItemizedItemEdit}
          cellData={{
            type: "number",
            name: "quantity",
            min: 1,
            step: "1",
            value: item.quantity,
            id: item.id,
          }}
        />
      </td>
      <td style={{ minWidth: "130px" }}>
        <EditableField
          onItemizedItemEdit={onItemizedItemEdit}
          cellData={{
            leading: currency,
            type: "number",
            name: "price",
            min: 1,
            step: "0.01",
            value: item.price,
            id: item.id,
          }}
        />
      </td>
      <td style={{ minWidth: "100px" }}>
        <EditableField
          onItemizedItemEdit={onItemizedItemEdit}
          cellData={{
            type: "number",
            name: "discount",
            min: 0,
            step: "0.01",
            max: 100,
            value: item.discount,
            id: item.id,
          }}
        />
      </td>
      <td style={{ minWidth: "100px", textAlign: "right" }}>
        {currency}{calculateSubtotal()}
      </td>
      <td className="text-center" style={{ minWidth: "50px" }}>
        <BiTrash
          onClick={handleDelete}
          style={{ height: "33px", width: "33px", padding: "7.5px" }}
          className="text-white mt-1 btn btn-danger"
        />
      </td>
    </tr>
  );
};

export default InvoiceItem;

