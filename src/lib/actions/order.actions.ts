import { auth } from "../../../auth";
import { prisma } from "../prisma";

export async function refreshBOGOrderStatuses() {
  try {
    const session = await auth();
    if (!session?.user?.id) return null;

    // Get all BOG orders for the user
    const bogOrders = await prisma.order.findMany({
      where: {
        userId: session.user.id,
        paymentMethod: { contains: 'BOG' }
      },
      select: {
        id: true,
        paymentMethod: true,
        isPaid: true,
        isDelivered: true,
        paidAt: true
      }
    });

    if (bogOrders.length === 0) return [];

  

    // Refresh each order status
    const refreshedOrders = await Promise.all(
      bogOrders.map(async (order) => {
        try {
          const response = await fetch(`/api/orders/bog-status/${order.id}`);
          if (response.ok) {
            const data = await response.json();
            return data.order;
          }
        } catch (error) {
          console.error(`Failed to refresh order ${order.id}:`, error);
        }
        return order;
      })
    );

    return refreshedOrders;
  } catch (error) {
    console.error('Error refreshing BOG order statuses:', error);
    return null;
  }
}

export async function getUserOrdersWithBOGStatus() {
  try {
    const session = await auth();
    if (!session?.user?.id) return null;

    // Get user with orders
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        Order: {
          take: 10,
          orderBy: { createdAt: "desc" },
          include: {
            orderitems: true
          }
        }
      }
    });

    if (!user) return null;

    // Refresh BOG order statuses
    await refreshBOGOrderStatuses();

    // Get updated orders
    const updatedOrders = await prisma.order.findMany({
      where: { userId: session.user.id },
      take: 10,
      orderBy: { createdAt: "desc" },
      include: {
        orderitems: true
      }
    });

    // Get user cart
    const cart = await prisma.cart.findFirst({
      where: { userId: session.user.id }
    });

    return {
      ...user,
      Order: updatedOrders,
      Cart: cart ? [cart] : []
    };
  } catch (error) {
    console.error('Error getting user orders with BOG status:', error);
    return null;
  }
}
