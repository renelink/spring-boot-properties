
package com.link_intersystems.spring.properties;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.AbstractEnvironment;
import org.springframework.core.env.Environment;
import org.springframework.core.env.MutablePropertySources;
import org.springframework.core.env.PropertySource;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = "spring")
public class SpringPropertiesRestController {

	private AbstractEnvironment environment;

	@Autowired
	public SpringPropertiesRestController(Environment environment) {

		this.environment = (AbstractEnvironment) environment;
	}

	@GetMapping(path = "properties", produces = MediaType.APPLICATION_JSON_VALUE)
	public List<PropertySourceTO> getPropertyTOs() {
		List<PropertySourceTO> propertySourcTOs = new ArrayList<>();

		MutablePropertySources propertySources = environment.getPropertySources();

		for (PropertySource<?> propertySource : propertySources) {
			PropertySourceIterator propertySourceIterator = new PropertySourceIterator(environment, propertySource);
			List<PropertyTO> propertyTOs = new ArrayList<>();
			propertySourceIterator.forEachRemaining(pse -> {
				String propertyName = pse.getPropertyName();
				String propertyValue = pse.getPropertyValue();
				PropertyTO propertyTO = new PropertyTO(propertyName, propertyValue);
				propertyTOs.add(propertyTO);
			});
			String propertySourceName = propertySource.getName();
			Pattern classpathResourcePattern = Pattern.compile("class path resource \\[([^\\]]+)]");
			Matcher classpathResourceMatcher = classpathResourcePattern.matcher(propertySourceName);
			if (classpathResourceMatcher.find()) {
				propertySourceName = classpathResourceMatcher.group(1);
			}
			propertySourcTOs.add(new PropertySourceTO(propertySourceName, propertyTOs));
		}

		return propertySourcTOs;

	}

	@GetMapping(path = "properties/{propertyName}", produces = MediaType.APPLICATION_JSON_VALUE)
	public PropertyTO getProperty(@PathVariable String propertyName) {
		String propertyValue = environment.getProperty(propertyName);

		return new PropertyTO(propertyName, propertyValue);
	}

}
