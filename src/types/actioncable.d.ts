declare let ActionCable: any;
// declare module '@rails/actioncable' {
//   interface Subscription {
//     unsubscribe(): void;
//     perform(action: string, data?: any): void;
//   }

//   interface Consumer {
//     subscriptions: {
//       create(
//         channel: string | { channel: string; [key: string]: any },
//         callbacks?: {
//           received?(data: any): void;
//           connected?(): void;
//           disconnected?(): void;
//         }
//       ): Subscription;
//     };
//     disconnect(): void;
//   }

//   function createConsumer(url?: string): Consumer;
//   export = createConsumer;
// }
