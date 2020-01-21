rd /s /q build

call npm run build-mekong

aws s3 cp build s3://who-mekong/ ^
    --region us-east-1 ^
    --recursive

aws cloudfront create-invalidation ^
    --distribution-id E2H1M5SL299FLR ^
    --paths /*
