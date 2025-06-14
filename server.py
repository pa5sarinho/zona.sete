import http.server
import socketserver

host = 'localhost'
port = 8000

handler = http.server.SimpleHTTPRequestHandler

with socketserver.TCPServer((host, port), handler) as server:
    print(f'Server started at http://{host}:{port}')
    server.serve_forever()
