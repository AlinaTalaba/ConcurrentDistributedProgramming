using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Threading.Tasks;

namespace Client
{
    class Client
    {
        static void Main(string[] args)
        {
            int port = 6001;
            string serverAddress = "127.0.0.1";

            TcpClient client = new TcpClient(serverAddress, port);

            Console.WriteLine("Client is connected to address {0}", serverAddress);

            string message = string.Empty;

            while(message!=null && !message.StartsWith("EXIT"))
            {
                Console.WriteLine("Enter the ecuation in the form /'operand operator operand/'");
                message = Console.ReadLine();

                NetworkStream stream = client.GetStream();

                stream.Write(Encoding.ASCII.GetBytes(message), 0, message.Length);
                Console.WriteLine("Ecuation {0} was sent to the server for processing.", message);

                var receivedData = new byte[1024];

                var response = stream.Read(receivedData, 0, receivedData.Length);

                var receivedMessage = Encoding.ASCII.GetString(receivedData, 0, response);

                Console.WriteLine("Answer = {0}", receivedMessage);

            }

            Console.WriteLine("Client connection is closed!");
            client.GetStream().Dispose();
            client.Dispose();
        }
    }
}
