<template>
	<div class="workspace-content inner-padding-horizontal inner-padding-bottom">
		<div class="workspace__title">
			<div class="workspace__title__text">Grid example</div>
			<div class="workspace__title__actions">
				<v-btn variant="tonal" @click="$router.go(-1)">Back</v-btn>
			</div>
		</div>

		<v-data-table :headers="headers" :items="plants" density="compact" class="w-full h-full" items-per-page="25"
			item-key="name"></v-data-table>
	</div>
</template>

<script>
export default {
	data: () => ({
		headers: [
			{ title: 'Plant', align: 'start', sortable: false, key: 'name' },
			{ title: 'Light', align: 'end', key: 'light' },
			{ title: 'Height', align: 'end', key: 'height' },
			{ title: 'Pet Friendly', align: 'end', key: 'petFriendly' },
			{ title: 'Price ($)', align: 'end', key: 'price' },
		],
		plants: [
			{
				name: 'Fern',
				light: 'Low',
				height: '20cm',
				petFriendly: 'Yes',
				price: 20,
			},
			{
				name: 'Snake Plant',
				light: 'Low',
				height: '50cm',
				petFriendly: 'No',
				price: 35,
			},
			{
				name: 'Monstera',
				light: 'Medium',
				height: '60cm',
				petFriendly: 'No',
				price: 50,
			},
			{
				name: 'Pothos',
				light: 'Low to medium',
				height: '40cm',
				petFriendly: 'Yes',
				price: 25,
			},
			{
				name: 'ZZ Plant',
				light: 'Low to medium',
				height: '90cm',
				petFriendly: 'Yes',
				price: 30,
			},
			{
				name: 'Spider Plant',
				light: 'Bright, indirect',
				height: '30cm',
				petFriendly: 'Yes',
				price: 15,
			},
			{
				name: 'Air Plant',
				light: 'Bright, indirect',
				height: '15cm',
				petFriendly: 'Yes',
				price: 10,
			},
			{
				name: 'Peperomia',
				light: 'Bright, indirect',
				height: '25cm',
				petFriendly: 'Yes',
				price: 20,
			},
			{
				name: 'Aloe Vera',
				light: 'Bright, direct',
				height: '30cm',
				petFriendly: 'Yes',
				price: 15,
			},
			{
				name: 'Jade Plant',
				light: 'Bright, direct',
				height: '40cm',
				petFriendly: 'Yes',
				price: 25,
			},
			{
				name: 'Fern',
				light: 'Low',
				height: '20cm',
				petFriendly: 'Yes',
				price: 20,
			},
			{
				name: 'Snake Plant',
				light: 'Low',
				height: '50cm',
				petFriendly: 'No',
				price: 35,
			},
			{
				name: 'Monstera',
				light: 'Medium',
				height: '60cm',
				petFriendly: 'No',
				price: 50,
			},
			{
				name: 'Pothos',
				light: 'Low to medium',
				height: '40cm',
				petFriendly: 'Yes',
				price: 25,
			},
			{
				name: 'ZZ Plant',
				light: 'Low to medium',
				height: '90cm',
				petFriendly: 'Yes',
				price: 30,
			},
			{
				name: 'Spider Plant',
				light: 'Bright, indirect',
				height: '30cm',
				petFriendly: 'Yes',
				price: 15,
			},
			{
				name: 'Air Plant',
				light: 'Bright, indirect',
				height: '15cm',
				petFriendly: 'Yes',
				price: 10,
			},
			{
				name: 'Peperomia',
				light: 'Bright, indirect',
				height: '25cm',
				petFriendly: 'Yes',
				price: 20,
			},
			{
				name: 'Aloe Vera',
				light: 'Bright, direct',
				height: '30cm',
				petFriendly: 'Yes',
				price: 15,
			},
			{
				name: 'Jade Plant',
				light: 'Bright, direct',
				height: '40cm',
				petFriendly: 'Yes',
				price: 25,
			},
			{
				name: 'Fern',
				light: 'Low',
				height: '20cm',
				petFriendly: 'Yes',
				price: 20,
			},
			{
				name: 'Snake Plant',
				light: 'Low',
				height: '50cm',
				petFriendly: 'No',
				price: 35,
			},
			{
				name: 'Monstera',
				light: 'Medium',
				height: '60cm',
				petFriendly: 'No',
				price: 50,
			},
			{
				name: 'Pothos',
				light: 'Low to medium',
				height: '40cm',
				petFriendly: 'Yes',
				price: 25,
			},
			{
				name: 'ZZ Plant',
				light: 'Low to medium',
				height: '90cm',
				petFriendly: 'Yes',
				price: 30,
			},
			{
				name: 'Spider Plant',
				light: 'Bright, indirect',
				height: '30cm',
				petFriendly: 'Yes',
				price: 15,
			},
			{
				name: 'Air Plant',
				light: 'Bright, indirect',
				height: '15cm',
				petFriendly: 'Yes',
				price: 10,
			},
			{
				name: 'Peperomia',
				light: 'Bright, indirect',
				height: '25cm',
				petFriendly: 'Yes',
				price: 20,
			},
			{
				name: 'Aloe Vera',
				light: 'Bright, direct',
				height: '30cm',
				petFriendly: 'Yes',
				price: 15,
			},
			{
				name: 'Jade Plant',
				light: 'Bright, direct',
				height: '40cm',
				petFriendly: 'Yes',
				price: 25,
			},
			{
				name: 'Fern',
				light: 'Low',
				height: '20cm',
				petFriendly: 'Yes',
				price: 20,
			},
			{
				name: 'Snake Plant',
				light: 'Low',
				height: '50cm',
				petFriendly: 'No',
				price: 35,
			},
			{
				name: 'Monstera',
				light: 'Medium',
				height: '60cm',
				petFriendly: 'No',
				price: 50,
			},
			{
				name: 'Pothos',
				light: 'Low to medium',
				height: '40cm',
				petFriendly: 'Yes',
				price: 25,
			},
			{
				name: 'ZZ Plant',
				light: 'Low to medium',
				height: '90cm',
				petFriendly: 'Yes',
				price: 30,
			},
			{
				name: 'Spider Plant',
				light: 'Bright, indirect',
				height: '30cm',
				petFriendly: 'Yes',
				price: 15,
			},
			{
				name: 'Air Plant',
				light: 'Bright, indirect',
				height: '15cm',
				petFriendly: 'Yes',
				price: 10,
			},
			{
				name: 'Peperomia',
				light: 'Bright, indirect',
				height: '25cm',
				petFriendly: 'Yes',
				price: 20,
			},
			{
				name: 'Aloe Vera',
				light: 'Bright, direct',
				height: '30cm',
				petFriendly: 'Yes',
				price: 15,
			},
			{
				name: 'Jade Plant',
				light: 'Bright, direct',
				height: '40cm',
				petFriendly: 'Yes',
				price: 25,
			},
		],
	}),
}
</script>
<style scoped></style>