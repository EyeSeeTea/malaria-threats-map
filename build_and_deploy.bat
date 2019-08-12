rd /s /q build

call npm run build

aws s3 cp build s3://malaria-v2/ ^
    --region us-east-1 ^
    --recursive

aws cloudfront create-invalidation ^
    --distribution-id E29VXHADKNVZL0 ^
    --paths /*
