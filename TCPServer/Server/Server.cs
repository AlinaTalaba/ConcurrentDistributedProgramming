﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Threading.Tasks;

namespace Server
{
    class Server
    {
        static void Main(string[] args)
        {
            TcpListener server = null;

            try
            {
                int port = 6001;
                IPAddress localhost = IPAddress.Parse("127.0.0.1");

                server = new TcpListener(localhost, port);
                server.Start();

                Byte[] readingBytes = new Byte[256];
                String receivedMessage = null;

                while (true)
                {
                    Console.WriteLine("Waiting for a client connection ...");

                    TcpClient client = server.AcceptTcpClient();
                    Console.WriteLine("Client connected!");

                    receivedMessage = null;

                    NetworkStream stream = client.GetStream();

                    int i;

                    while((i = stream.Read(readingBytes, 0, readingBytes.Length)) != 0)
                    {
                        receivedMessage = System.Text.Encoding.ASCII.GetString(readingBytes, 0, i);

                        receivedMessage = receivedMessage.ToUpper();

                        if (receivedMessage != "EXIT")
                        {
                            Console.WriteLine("Ecuation Received: {0}", receivedMessage);

                            int result = 0;
                            byte[] msg;
                            string[] ecuationElements = receivedMessage.Split(' ');

                            if (ecuationElements.Length == 3) {
                                try
                                {
                                    int operand1 = int.Parse(ecuationElements[0]);
                                    string operation = ecuationElements[1];
                                    int operand2 = int.Parse(ecuationElements[2]);

                                    switch (operation)
                                    {
                                        case "+":
                                            result = operand1 + operand2;
                                            break;
                                        case "-":
                                            result = operand1 - operand2;
                                            break;
                                        case "*":
                                            result = operand1 * operand2;
                                            break;
                                        case "/":
                                            if (operand2 != 0)
                                            {
                                                result = operand1 / operand2;
                                            }
                                            else
                                            {
                                                result = 0;
                                            }
                                            break;
                                    }

                                    msg = System.Text.Encoding.ASCII.GetBytes(result.ToString());
                                    Console.WriteLine("Sending the result: {0}", result.ToString());
                                    Console.WriteLine();
                                }
                                catch(Exception ex)
                                {
                                    msg = System.Text.Encoding.ASCII.GetBytes("Invalid Input! Try again.");
                                    Console.WriteLine("Sending the result: Invalid Input! Try again.");
                                    Console.WriteLine();
                                }
                                
                            }
                            else
                            {
                                msg = System.Text.Encoding.ASCII.GetBytes("Invalid Input! Try again.");
                                Console.WriteLine("Sending the result: Invalid Input! Try again.");
                                Console.WriteLine();
                            }

                            stream.Write(msg, 0, msg.Length);
                        }
                        else
                        {
                            client.Close();
                        }
                    }
                }
            }
            catch (Exception e)
            {
                Console.WriteLine("Exception Occured: {0}", e.Message);
            }
            finally
            {
                server.Stop();
            }
        }
    }
}
