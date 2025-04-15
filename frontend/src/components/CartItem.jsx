import React from 'react';

const CartItem = ({ item, onQuantityChange, onRemove }) => {
    return (
      <tr key={item._id}>
        <td>{item.productId.productName}</td>
        <td>
          <input
            type="number"
            value={item.quantity}
            min="1"
            onChange={(e) => onQuantityChange(item.productId.productID, parseInt(e.target.value))}
          />
        </td>
        
        <td>${item.productPrice || 0}</td>
        <td>
          <button onClick={() => onRemove(item.productId.productID)}>Remove</button>
        </td>
      </tr>
    );
  };
  

export default CartItem;
