0 20 6 */1 *    curl --location --request POST 'http://127.0.0.1:3000/sendText' \
--header 'Content-Type: application/json' \
--data-raw '{
   "wcId" :"19112831499@chatroom",
    "content": "兴业还款提醒"
}'

0 20 7 */1 *    curl --location --request POST 'http://127.0.0.1:3000/sendText' \
--header 'Content-Type: application/json' \
--data-raw '{
   "wcId" :"19112831499@chatroom",
    "content": "广大还款提醒"
}'
0 20 17 */1 *    curl --location --request POST 'http://127.0.0.1:3000/sendText' \
--header 'Content-Type: application/json' \
--data-raw '{
   "wcId" :"19112831499@chatroom",
    "content": "交通/浦发还款提醒"
}'

0 20 24 */1 *    curl --location --request POST 'http://127.0.0.1:3000/sendText' \
--header 'Content-Type: application/json' \
--data-raw '{
   "wcId" :"19112831499@chatroom",
    "content": "招商/广发/中信/华夏还款提醒"
}'