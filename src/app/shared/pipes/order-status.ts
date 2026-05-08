import { Pipe, PipeTransform } from '@angular/core';
import { OrderStatus } from '../../interfaces/order';

@Pipe({ name: 'orderStatus', standalone: true })
export class OrderStatusPipe implements PipeTransform {
  transform(status: OrderStatus): string {
     switch (status) {
      case 'PENDING':   return 'Pendiente';
      case 'APPROVED':  return 'Aprobada';
      case 'RECEIVED':  return 'Recibida';
      case 'CANCELLED': return 'Cancelada';
      case 'FAILED':    return 'Fallida';
      default:          return status;
    };
  }
}

// Clase helper para obtener el color del badge
export function orderStatusColor(status: OrderStatus): string {
    switch (status) {
    case 'PENDING':   return 'warn';
    case 'APPROVED':  return 'primary';
    case 'RECEIVED':  return 'accent';
    case 'CANCELLED': return '';
    case 'FAILED':    return 'warn';
    default:          return '';
  };
}