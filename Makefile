deploy:
	aws s3 cp ./dist s3://$(BUCKET_NAME)/ \
  --cache-control immutable,max-age=100000000,public \
  --recursive