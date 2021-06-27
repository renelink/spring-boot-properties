
package com.link_intersystems.spring.properties;

import java.util.Arrays;
import java.util.Collections;
import java.util.Iterator;
import java.util.List;
import java.util.Optional;

import org.springframework.core.env.AbstractEnvironment;
import org.springframework.core.env.EnumerablePropertySource;
import org.springframework.core.env.PropertySource;

public class PropertySourceIterator implements Iterator<PropertySourceEntry> {

	private PropertySource<?> propertySource;
	private Iterator<String> propertyNamesIterator;
	private AbstractEnvironment environment;

	public PropertySourceIterator(AbstractEnvironment environment, PropertySource<?> propertySource) {

		this.environment = environment;
		this.propertySource = propertySource;

		if (propertySource instanceof EnumerablePropertySource<?>) {
			EnumerablePropertySource<?> enumerablePropertySource = (EnumerablePropertySource<?>) propertySource;
			List<String> propertyNames = Arrays.asList(enumerablePropertySource.getPropertyNames());
			Collections.sort(propertyNames);
			propertyNamesIterator = propertyNames.iterator();
		} else {
			propertyNamesIterator = Collections.emptyIterator();
		}
	}

	public String getPropertySourceName() {
		return propertySource.getName();
	}

	@Override
	public boolean hasNext() {
		return propertyNamesIterator.hasNext();
	}

	@Override
	public PropertySourceEntry next() {
		if (!hasNext()) {
			throw new IllegalStateException("No next entry available");
		}

		String propertyName = propertyNamesIterator.next();
		return new PropertySourceEntry() {

			@Override
			public String getPropertyName() {

				return propertyName;
			}

			@Override
			public String getPropertyValue() {

				return Optional.ofNullable(propertySource.getProperty(propertyName)).map(String::valueOf).orElse(null);
			}

			@Override
			public String getResolvedPropertyValue() {

				return environment.getProperty(propertyName);
			}

		};
	}
}
